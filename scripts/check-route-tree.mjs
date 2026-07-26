import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const routeTreePath = path.join(process.cwd(), 'src', 'routeTree.gen.ts')
const before = readFileSync(routeTreePath)
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const build = spawnSync(pnpm, ['run', 'build'], {
  cwd: process.cwd(),
  stdio: 'inherit',
})

if (build.error) throw build.error
if (build.status !== 0) process.exit(build.status ?? 1)

const after = readFileSync(routeTreePath)
if (!before.equals(after)) {
  console.error('TanStack Start updated src/routeTree.gen.ts during build. Inspect and commit the generated route tree, then run verify again.')
  process.exitCode = 1
}
