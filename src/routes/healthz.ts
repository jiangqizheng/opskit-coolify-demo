import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: async () => Response.json({
        status: 'ok',
        service: 'coolify-demo',
        release: process.env.DEMO_RELEASE ?? 'local-dev',
        region: process.env.DEMO_REGION ?? 'bj-2c8g',
        domain: process.env.DEMO_DOMAIN ?? 'coolify-demo.perphq.com',
        checkedAt: new Date().toISOString(),
      }, {
        headers: { 'Cache-Control': 'no-store' },
      }),
    },
  },
})
