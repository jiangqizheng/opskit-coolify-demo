import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import path from 'node:path'
import process from 'node:process'

import { createRotatingLogStream, resolveLogMaxBytes } from './lib/rotating-log.mjs'

function readConfiguredPort() {
  if (process.env.PORT) {
    return Number(process.env.PORT)
  }

  try {
    const portless = JSON.parse(readFileSync('portless.json', 'utf8'))
    return Number(portless.appPort || 9030)
  } catch {
    return 9030
  }
}

const port = readConfiguredPort()
const host = process.env.HOST || '127.0.0.1'
const logDir = path.join(process.cwd(), '.tmp', 'logs')
const logPath = path.join(logDir, 'dev.log')
const previousLogPath = path.join(logDir, 'dev.previous.log')
const logStream = process.env.PF_RUNTIME_LOG_CAPTURED === '1'
  ? undefined
  : createRotatingLogStream({
      filePath: logPath,
      previousPath: previousLogPath,
      maxBytes: resolveLogMaxBytes(process.env.PF_PROJECT_LOG_MAX_BYTES),
    })
writeLocalLog(`[dev] started ${new Date().toISOString()} host=${host} port=${port}\n`)

function log(message) {
  console.log(message)
  writeLocalLog(`${message}\n`)
}

function writeLocalLog(message) {
  logStream?.write(message)
}

function pipeOutput(child) {
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  if (logStream) {
    child.stdout.pipe(logStream, { end: false })
    child.stderr.pipe(logStream, { end: false })
  }
}

async function isPortOpen(targetPort) {
  return new Promise((resolve) => {
    const server = createServer()

    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(targetPort, host)
  })
}

async function killPort(targetPort) {
  if (process.platform === 'win32') {
    await run('cmd.exe', [
      '/c',
      `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${targetPort}') do taskkill /F /PID %a`,
    ])
    return
  }

  await run('sh', ['-c', `lsof -ti tcp:${targetPort} | xargs -r kill -9`])
}

async function ensureDependencies() {
  if (existsSync('node_modules')) {
    return
  }

  log('node_modules not found. Installing dependencies...')
  await run('pnpm', ['install'])
}

async function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'] })
    pipeOutput(child)
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code && code !== 0) {
        reject(new Error(`${command} exited with code ${code}`))
        return
      }
      resolve()
    })
  })
}

await ensureDependencies()

if (!(await isPortOpen(port))) {
  log(`Port ${port} is busy. Killing the process that owns it...`)
  await killPort(port)
}

const vite = spawn(
  'pnpm',
  ['exec', 'vite', 'dev', '--host', host, '--port', String(port), '--strictPort'],
  {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  },
)

pipeOutput(vite)

process.on('SIGINT', () => vite.kill('SIGINT'))
process.on('SIGTERM', () => vite.kill('SIGTERM'))

vite.on('exit', (code, signal) => {
  writeLocalLog(`[dev] exited ${new Date().toISOString()} code=${code ?? ''} signal=${signal ?? ''}\n`)
  logStream?.end()
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
