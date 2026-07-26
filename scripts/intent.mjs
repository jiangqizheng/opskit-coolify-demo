#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export const intentPackage = '@tanstack/intent@0.3.5'

function readPackage(directory) {
  const file = path.join(directory, 'package.json')
  if (!fs.existsSync(file)) return undefined
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function declaredTanStackDependencies(packageJson) {
  return Object.keys({
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  }).filter((name) => name.startsWith('@tanstack/'))
}

export function resolveTanStackPackageRoot(projectRoot = process.cwd()) {
  for (const directory of [projectRoot, path.join(projectRoot, 'apps', 'web')]) {
    const packageJson = readPackage(directory)
    if (packageJson && declaredTanStackDependencies(packageJson).length > 0) {
      return { directory, packageJson }
    }
  }

  throw new Error(
    'No TanStack package was found. Expected declared @tanstack dependencies in package.json at the project root or apps/web.',
  )
}

export function assertTanStackDependenciesInstalled(directory, packageJson, projectRoot = process.cwd()) {
  const declared = declaredTanStackDependencies(packageJson)
  const hasInstalledPackage = declared.some((name) => fs.existsSync(path.join(directory, 'node_modules', ...name.split('/'))))
  if (hasInstalledPackage) return

  const relativeDirectory = path.relative(projectRoot, directory) || '.'
  throw new Error(
    `TanStack dependencies are declared in ${relativeDirectory}/package.json but are not installed. ` +
    'Run pnpm install from the workspace root, then retry pnpm run intent:list.',
  )
}

export function runIntent(argv = process.argv.slice(2), options = {}) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd())
  const spawnCommand = options.spawnCommand ?? spawnSync
  const { directory, packageJson } = resolveTanStackPackageRoot(projectRoot)
  assertTanStackDependenciesInstalled(directory, packageJson, projectRoot)
  const intentArguments = argv[0] === '--' ? argv.slice(1) : argv

  const relativeDirectory = path.relative(projectRoot, directory) || '.'
  process.stderr.write(`[intent] TanStack package root: ${relativeDirectory}\n`)
  const result = spawnCommand('pnpm', ['dlx', intentPackage, ...(intentArguments.length > 0 ? intentArguments : ['list'])], {
    cwd: directory,
    env: process.env,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  return result.status ?? 1
}

export function main(argv = process.argv.slice(2)) {
  try {
    process.exitCode = runIntent(argv)
  } catch (error) {
    process.stderr.write(`[intent] ${error.message}\n`)
    process.exitCode = 1
  }
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectExecution) main()
