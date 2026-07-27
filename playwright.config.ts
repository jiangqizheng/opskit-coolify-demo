import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function readConfiguredPort() {
  if (process.env.PORT) {
    return Number(process.env.PORT)
  }

  try {
    const portless = JSON.parse(readFileSync(join(process.cwd(), 'portless.json'), 'utf8'))
    return Number(portless.appPort || 9030)
  } catch {
    return 9030
  }
}

const port = readConfiguredPort()
const usesExternalServer = Boolean(process.env.PW_SKIP_WEBSERVER)
const testPort = usesExternalServer ? port : Number(process.env.PW_TEST_PORT || port + 10_000)
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${testPort}`

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        command: `pnpm run build && HOST=127.0.0.1 PORT=${testPort} pnpm start`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 60_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
