#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import process from 'node:process'

const args = process.argv.slice(2)
if (args[0] === '--') args.shift()

const command = args[0] ?? 'status'
const projectScopedCommands = new Set([
  'status',
  'inspect',
  'start',
  'group',
  'plan',
  'work-doctor',
])
if (projectScopedCommands.has(command) && !args.includes('--project')) {
  args.push('--project', process.cwd())
}

const executable = process.env.PF_CLI || 'pf'
const result = spawnSync(executable, ['work', ...args], {
  encoding: 'utf8',
  stdio: 'inherit',
  shell: false,
})

if (result.error?.code === 'ENOENT') {
  console.error('PF CLI is not installed. Run `pnpm link --global` in the proj-factory repository.')
  process.exitCode = 1
} else if (result.error) {
  console.error(result.error.message)
  process.exitCode = 1
} else {
  process.exitCode = result.status ?? 1
}
