import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { toast } from 'sonner'

import { Toaster } from './sonner'

beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
})

afterEach(() => {
  toast.dismiss()
  cleanup()
})

test('renders interaction feedback in the top-right viewport', async () => {
  const { container } = render(<Toaster />)

  toast.success('Template feedback')

  await screen.findByText('Template feedback')
  const viewport = container.querySelector('[data-sonner-toaster]')
  expect(viewport?.getAttribute('data-x-position')).toBe('right')
  expect(viewport?.getAttribute('data-y-position')).toBe('top')
})
