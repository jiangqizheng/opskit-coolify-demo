import { createHash } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const RELEASE_PROJECT_ID = 'coolify-demo'
export const RELEASE_SERVICE_ID = 'web'
export const RELEASE_ENVIRONMENT = 'production'
export const RELEASE_IMAGE_REPOSITORY = 'ccr.ccs.tencentyun.com/opskit/coolify-demo'
export const RELEASE_PLATFORM = 'linux/amd64'
export const RELEASE_REGION = 'bj-2c8g'
export const RELEASE_DOMAIN = 'coolify-demo.perphq.com'
export const RELEASE_HEALTH_URL = `https://${RELEASE_DOMAIN}/healthz`

type ReleaseReceiptInput = {
  sourceCommit: string
  artifactDigest: string
  workflowRepository: string
  workflowRunId: string
  workflowRunAttempt: string
  createdAt?: string
}

export type ReleaseReceipt = ReturnType<typeof createReleaseReceipt>

export function createReleaseReceipt(input: ReleaseReceiptInput) {
  const sourceCommit = gitCommit(input.sourceCommit)
  const artifactDigest = sha256Digest(input.artifactDigest)
  const workflowRepository = githubRepository(input.workflowRepository)
  const workflowRunId = positiveInteger(input.workflowRunId, 'workflow run id')
  const workflowRunAttempt = positiveInteger(input.workflowRunAttempt, 'workflow run attempt')
  const artifactRef = {
    kind: 'container-image' as const,
    uri: `oci://${RELEASE_IMAGE_REPOSITORY}@${artifactDigest}`,
    digest: artifactDigest,
  }
  const build = {
    platform: RELEASE_PLATFORM,
    dockerfile: 'Dockerfile',
    arguments: {
      DEMO_RELEASE: sourceCommit,
      DEMO_REGION: RELEASE_REGION,
      DEMO_DOMAIN: RELEASE_DOMAIN,
    },
  }
  const manifestHash = sha256(canonicalJson({
    projectId: RELEASE_PROJECT_ID,
    serviceId: RELEASE_SERVICE_ID,
    environment: RELEASE_ENVIRONMENT,
    sourceCommit,
    artifactRef,
    build,
  }))

  return {
    schemaVersion: 1 as const,
    kind: 'opskit.project-release-receipt' as const,
    projectId: RELEASE_PROJECT_ID,
    serviceId: RELEASE_SERVICE_ID,
    environment: RELEASE_ENVIRONMENT,
    sourceCommit,
    artifactDigest,
    manifestHash,
    provenanceRef: `github-actions:${workflowRepository}:${workflowRunId}:${workflowRunAttempt}`,
    artifactRef,
    build,
    workflow: {
      repository: workflowRepository,
      runId: workflowRunId,
      runAttempt: workflowRunAttempt,
    },
    createdAt: isoTimestamp(input.createdAt ?? new Date().toISOString()),
  }
}

export async function writeReleaseReceipt(filePath: string, receipt: ReleaseReceipt) {
  const output = resolve(filePath)
  const temporary = `${output}.${process.pid}.tmp`
  await mkdir(dirname(output), { recursive: true })
  try {
    await writeFile(temporary, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o600 })
    await rename(temporary, output)
  } finally {
    await rm(temporary, { force: true })
  }
  return output
}

type ReleaseVerificationDependencies = {
  readHealth?: () => Promise<unknown>
  now?: () => number
  sleep?: (milliseconds: number) => Promise<void>
}

export async function waitForPublicRelease(
  input: { sourceCommit: string; timeoutMs?: number; intervalMs?: number },
  dependencies: ReleaseVerificationDependencies = {},
) {
  const expectedCommit = gitCommit(input.sourceCommit)
  const timeoutMs = boundedInteger(input.timeoutMs ?? 600_000, 'timeout', 1, 1_800_000)
  const intervalMs = boundedInteger(input.intervalMs ?? 5_000, 'interval', 1, 60_000)
  const now = dependencies.now ?? Date.now
  const sleep = dependencies.sleep ?? ((milliseconds) => new Promise((accept) => setTimeout(accept, milliseconds)))
  const readHealth = dependencies.readHealth ?? readPublicHealth
  const startedAt = now()
  let attempts = 0
  let lastIssue = '尚未收到健康响应。'

  while (now() - startedAt <= timeoutMs) {
    attempts += 1
    try {
      const health = releaseHealth(await readHealth())
      if (health.release === expectedCommit) {
        return {
          status: 'ready' as const,
          url: RELEASE_HEALTH_URL,
          release: health.release,
          region: health.region,
          domain: health.domain,
          attempts,
          verifiedAt: new Date().toISOString(),
        }
      }
      lastIssue = `公网仍在运行 release ${health.release}。`
    } catch (error) {
      lastIssue = error instanceof Error ? error.message : '公网健康响应无效。'
    }

    const elapsed = now() - startedAt
    if (elapsed >= timeoutMs) break
    await sleep(Math.min(intervalMs, timeoutMs - elapsed))
  }

  throw new Error(`等待公网 release ${expectedCommit} 超时：${lastIssue}`)
}

async function readPublicHealth() {
  const response = await fetch(RELEASE_HEALTH_URL, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`公网健康检查返回 HTTP ${response.status}。`)
  return response.json() as Promise<unknown>
}

function releaseHealth(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('公网健康响应不是对象。')
  const value = input as Record<string, unknown>
  if (value.status !== 'ok' || value.service !== RELEASE_PROJECT_ID) throw new Error('公网服务尚未 ready。')
  if (value.region !== RELEASE_REGION || value.domain !== RELEASE_DOMAIN) throw new Error('公网 release 运行在错误的目标上。')
  return {
    release: gitCommit(value.release),
    region: RELEASE_REGION,
    domain: RELEASE_DOMAIN,
  }
}

function gitCommit(value: unknown) {
  if (typeof value !== 'string' || !/^[a-f0-9]{40}$/.test(value)) throw new Error('source commit 必须是完整的 40 位小写 Git SHA。')
  return value
}

function sha256Digest(value: unknown) {
  if (typeof value !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(value)) throw new Error('artifact digest 必须是 sha256:<64 hex>。')
  return value
}

function githubRepository(value: unknown) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
    throw new Error('workflow repository 必须是 owner/repository。')
  }
  return value
}

function positiveInteger(value: unknown, label: string) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) throw new Error(`${label} 必须是正整数。`)
  return value
}

function boundedInteger(value: number, label: string, minimum: number, maximum: number) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${label} 必须是 ${minimum}-${maximum} 之间的整数。`)
  }
  return value
}

function isoTimestamp(value: string) {
  if (!Number.isFinite(Date.parse(value))) throw new Error('createdAt 必须是 ISO 时间。')
  return value
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function sha256(value: string) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

function option(args: string[], name: string) {
  const index = args.indexOf(name)
  const value = index >= 0 ? args[index + 1] : undefined
  if (!value || value.startsWith('--')) throw new Error(`缺少 ${name}。`)
  return value
}

async function runCli() {
  const [command, ...args] = process.argv.slice(2).filter((argument) => argument !== '--')
  if (command === 'receipt') {
    const receipt = createReleaseReceipt({
      sourceCommit: option(args, '--source-commit'),
      artifactDigest: option(args, '--artifact-digest'),
      workflowRepository: option(args, '--workflow-repository'),
      workflowRunId: option(args, '--workflow-run-id'),
      workflowRunAttempt: option(args, '--workflow-run-attempt'),
    })
    const output = await writeReleaseReceipt(option(args, '--output'), receipt)
    console.log(JSON.stringify({
      status: 'ready',
      output,
      sourceCommit: receipt.sourceCommit,
      artifactDigest: receipt.artifactDigest,
      manifestHash: receipt.manifestHash,
      provenanceRef: receipt.provenanceRef,
    }, null, 2))
    return
  }
  if (command === 'verify') {
    console.log(JSON.stringify(await waitForPublicRelease({
      sourceCommit: option(args, '--source-commit'),
    }), null, 2))
    return
  }
  throw new Error('Usage: pnpm release -- <receipt|verify> [options]')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'release 命令失败。')
    process.exitCode = 1
  })
}
