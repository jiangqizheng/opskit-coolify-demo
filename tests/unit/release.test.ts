import { mkdir, readFile, rm, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createReleaseReceipt,
  RELEASE_DOMAIN,
  RELEASE_HEALTH_URL,
  RELEASE_IMAGE_REPOSITORY,
  RELEASE_REGION,
  waitForPublicRelease,
  writeReleaseReceipt,
} from '../../scripts/release.ts'

const sourceCommit = '9da116d607c122ba4178d4fe8a57f75a55a2a019'
const artifactDigest = `sha256:${'a'.repeat(64)}`
const temporaryRoot = resolve('.tmp/release-contract-test')

afterEach(async () => {
  await rm(temporaryRoot, { recursive: true, force: true })
})

describe('project release contract', () => {
  it('creates stable immutable release identity from a GitHub build', () => {
    const first = createReleaseReceipt({
      sourceCommit,
      artifactDigest,
      workflowRepository: 'jiangqizheng/opskit-coolify-demo',
      workflowRunId: '101',
      workflowRunAttempt: '1',
      createdAt: '2026-07-27T00:00:00.000Z',
    })
    const retry = createReleaseReceipt({
      sourceCommit,
      artifactDigest,
      workflowRepository: 'jiangqizheng/opskit-coolify-demo',
      workflowRunId: '102',
      workflowRunAttempt: '2',
      createdAt: '2026-07-27T01:00:00.000Z',
    })

    expect(first).toMatchObject({
      schemaVersion: 1,
      kind: 'opskit.project-release-receipt',
      projectId: 'coolify-demo',
      serviceId: 'web',
      environment: 'production',
      sourceCommit,
      artifactDigest,
      artifactRef: {
        kind: 'container-image',
        uri: `oci://${RELEASE_IMAGE_REPOSITORY}@${artifactDigest}`,
        digest: artifactDigest,
      },
      build: {
        platform: 'linux/amd64',
        arguments: {
          DEMO_RELEASE: sourceCommit,
          DEMO_REGION: RELEASE_REGION,
          DEMO_DOMAIN: RELEASE_DOMAIN,
        },
      },
      provenanceRef: 'github-actions:jiangqizheng/opskit-coolify-demo:101:1',
    })
    expect(first.manifestHash).toMatch(/^sha256:[a-f0-9]{64}$/)
    expect(retry.manifestHash).toBe(first.manifestHash)
  })

  it('atomically writes a private receipt file', async () => {
    await mkdir(temporaryRoot, { recursive: true })
    const receipt = createReleaseReceipt({
      sourceCommit,
      artifactDigest,
      workflowRepository: 'jiangqizheng/opskit-coolify-demo',
      workflowRunId: '101',
      workflowRunAttempt: '1',
    })
    const output = resolve(temporaryRoot, 'release.json')

    await writeReleaseReceipt(output, receipt)

    expect(JSON.parse(await readFile(output, 'utf8'))).toEqual(receipt)
    expect((await stat(output)).mode & 0o777).toBe(0o600)
  })

  it('waits until the public health endpoint reports the expected commit', async () => {
    let clock = 0
    let calls = 0
    const result = await waitForPublicRelease({ sourceCommit, timeoutMs: 2_000, intervalMs: 100 }, {
      now: () => clock,
      sleep: async (milliseconds) => { clock += milliseconds },
      readHealth: async () => {
        calls += 1
        return {
          status: 'ok',
          service: 'coolify-demo',
          release: calls === 1 ? '1'.repeat(40) : sourceCommit,
          region: RELEASE_REGION,
          domain: RELEASE_DOMAIN,
        }
      },
    })

    expect(result).toMatchObject({
      status: 'ready',
      url: RELEASE_HEALTH_URL,
      release: sourceCommit,
      region: RELEASE_REGION,
      domain: RELEASE_DOMAIN,
      attempts: 2,
    })
  })

  it('stops when the expected release never becomes public', async () => {
    let clock = 0
    await expect(waitForPublicRelease({ sourceCommit, timeoutMs: 200, intervalMs: 100 }, {
      now: () => clock,
      sleep: async (milliseconds) => { clock += milliseconds },
      readHealth: async () => ({
        status: 'ok',
        service: 'coolify-demo',
        release: '1'.repeat(40),
        region: RELEASE_REGION,
        domain: RELEASE_DOMAIN,
      }),
    })).rejects.toThrow(`等待公网 release ${sourceCommit} 超时`)
  })
})
