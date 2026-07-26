#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

function readJson(file) {
  return JSON.parse(readFileSync(path.join(root, file), 'utf8'))
}

function request(url) {
  return new Promise((resolve) => {
    const started = Date.now()
    const client = url.startsWith('https:') ? https : http
    const req = client.request(
      url,
      {
        method: 'GET',
        timeout: 5000,
        rejectUnauthorized: false,
      },
      (res) => {
        res.resume()
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 400,
            status: res.statusCode,
            ms: Date.now() - started,
          })
        })
      },
    )

    req.on('timeout', () => {
      req.destroy(new Error('timeout'))
    })
    req.on('error', (error) => {
      resolve({ ok: false, error: error.message, ms: Date.now() - started })
    })
    req.end()
  })
}

function statusLine(label, result) {
  const suffix = result.status ? `HTTP ${result.status}` : result.error
  return `${label}: ${result.ok ? 'ok' : 'failed'} (${suffix}, ${result.ms}ms)`
}

function portlessList() {
  try {
    return execFileSync('pnpm', ['exec', 'portless', 'list'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch (error) {
    const stderr = error.stderr?.toString().trim()
    return stderr || error.message
  }
}

const portless = readJson('portless.json')
const pkg = readJson('package.json')
const name = portless.name || pkg.name
const script = portless.script || 'dev'
const appPort = Number(portless.appPort || process.env.PORT || 9030)
const appHost = process.env.HOST || '127.0.0.1'

if (!name) {
  console.error('portless.json must define name, or package.json must define name.')
  process.exit(1)
}
if (!Number.isInteger(appPort) || appPort < 1) {
  console.error(`Invalid portless appPort: ${portless.appPort}`)
  process.exit(1)
}
if (!pkg.scripts?.[script]) {
  console.error(`portless.json script "${script}" is not defined in package.json scripts.`)
  process.exit(1)
}

const directUrl = `http://${appHost}:${appPort}/`
const httpsUrl = `https://${name}.localhost/`
const httpUrl = `http://${name}.localhost/`

console.log(`Preview config: name=${name} script=${script} appPort=${appPort}`)
console.log(`Direct app URL: ${directUrl}`)
console.log(`Portless URL: ${httpsUrl}`)

const [direct, viaHttps, viaHttp] = await Promise.all([request(directUrl), request(httpsUrl), request(httpUrl)])

console.log(statusLine('direct app', direct))
console.log(statusLine('portless https', viaHttps))
console.log(statusLine('portless http', viaHttp))

if (direct.ok && (viaHttps.status === 502 || viaHttp.status === 502 || (!viaHttps.ok && !viaHttp.ok))) {
  console.log('\nDiagnosis: the app is reachable directly, but Portless is not proxying it correctly.')
  console.log('Check Portless route state with:')
  console.log('  pnpm exec portless list')
  console.log('Then restart the preview. If stale routes remain, run:')
  console.log('  pnpm exec portless prune')
  console.log('  pnpm run dev')
  process.exitCode = 1
} else if (!direct.ok) {
  console.log('\nDiagnosis: the app server is not reachable on the configured fixed port.')
  console.log('Check logs with:')
  console.log('  pnpm run logs')
  process.exitCode = 1
} else {
  console.log('\nDiagnosis: direct app and Portless preview are reachable.')
}

console.log('\nPortless routes:')
console.log(portlessList() || '(no routes reported)')
