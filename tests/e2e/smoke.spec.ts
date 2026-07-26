import { expect, test } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /ship the small idea/i })).toBeVisible()
  await expect(page.getByText('bj-2c8g', { exact: true })).toBeVisible()
  const stylesheetHref = await page.locator('link[rel="stylesheet"]').first().getAttribute('href')
  expect(stylesheetHref).toBeTruthy()
  const stylesheet = await page.request.get(stylesheetHref!)
  expect(stylesheet.status()).toBe(200)
  expect(stylesheet.headers()['content-type']).toContain('text/css')
  await expect(page.locator('body')).toHaveCSS('font-family', /Manrope/)
  await expect(page.getByRole('region', { name: /^Notifications/ })).toBeAttached()
  await page.screenshot({ path: 'test-results/home.png', fullPage: true })
})

test('health endpoint returns an explicit readiness payload', async ({ request }) => {
  const response = await request.get('/healthz')
  expect(response.status()).toBe(200)
  await expect(response).toBeOK()
  const body = await response.json()
  expect(body.status).toBe('ok')
  expect(body.service).toBe('coolify-demo')
  expect(body.region).toBeTruthy()
})

test('not found page renders alert', async ({ page }) => {
  await page.goto('/missing-route')
  await expect(page.getByRole('alert')).toContainText(/page not found/i)
  await page.screenshot({ path: 'test-results/not-found.png', fullPage: true })
})
