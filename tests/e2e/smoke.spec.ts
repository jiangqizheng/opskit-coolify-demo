import { expect, test } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /start simple/i })).toBeVisible()
  await expect(page.getByRole('region', { name: /^Notifications/ })).toBeAttached()
  await page.screenshot({ path: 'test-results/home.png', fullPage: true })
})

test('not found page renders alert', async ({ page }) => {
  await page.goto('/missing-route')
  await expect(page.getByRole('alert')).toContainText(/page not found/i)
  await page.screenshot({ path: 'test-results/not-found.png', fullPage: true })
})
