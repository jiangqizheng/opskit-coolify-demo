#!/usr/bin/env node
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { followLogFile, readTailLines } from './lib/log-tail.mjs'

const root = process.cwd()
const defaultLogPath = path.join(root, '.tmp', 'logs', 'dev.log')

function usage() {
  console.log(`Usage:
  pnpm run logs [--lines <count>] [--follow] [--file <path>]

Examples:
  pnpm run logs
  pnpm run logs -- --lines 400
  pnpm run logs:follow`)
}

function parseArgs(args) {
  const values = { lines: 200, follow: false, file: defaultLogPath }
  for (let index = 0; index < args.length; index++) {
    const item = args[index]
    if (item === '--') {
      continue
    }
    if (item === '--help' || item === '-h') {
      values.help = true
      continue
    }
    if (item === '--follow' || item === '-f') {
      values.follow = true
      continue
    }
    if (item === '--lines' || item === '-n') {
      values.lines = Number(args[index + 1])
      index++
      continue
    }
    if (item === '--file') {
      values.file = path.resolve(root, args[index + 1])
      index++
      continue
    }
    throw new Error(`Unknown argument: ${item}`)
  }
  if (!Number.isInteger(values.lines) || values.lines < 1) {
    throw new Error('--lines must be a positive integer')
  }
  return values
}

function tailLines(file, count) {
  if (!existsSync(file)) {
    console.error(`No log file found at ${path.relative(root, file)}. Start the app with pnpm run dev first.`)
    process.exitCode = 1
    return
  }

  const text = readTailLines(file, { lines: count })
  process.stdout.write(text.endsWith('\n') ? text : `${text}\n`)
}

function follow(file) {
  const stop = followLogFile(file)

  process.on('SIGINT', () => {
    stop()
    process.exit(0)
  })
}

try {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    process.exit(0)
  }
  tailLines(args.file, args.lines)
  if (args.follow) follow(args.file)
} catch (error) {
  console.error(error.message)
  usage()
  process.exit(1)
}
