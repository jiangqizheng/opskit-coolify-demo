import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      'dist/**',
      'dist-ssr/**',
      '.tanstack/**',
      '.tmp/**',
      '.cache/**',
      'refs/**',
    ],
  },
})
