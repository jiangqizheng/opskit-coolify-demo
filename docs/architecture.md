# Technical Architecture

> Status: draft
> Purpose: current technical facts for AI agents

## Stack

- Framework: TanStack Start
- Runtime: Node.js 24
- UI: React
- Routing: TanStack Router
- Server state: TanStack Query
- Styling: Tailwind CSS
- Validation: Zod when schema validation is needed
- Persistence: none; the deployed service is stateless and fully derived from
  its immutable container image
- Auth: Clerk when authentication is needed
- Testing: Vitest and Playwright
- Preview: Portless with managed ports starting at `9030`

## Source Layout

```text
src/
  components/
    ui/
      alert.tsx
      button.tsx
      select.tsx
      sonner.tsx
  lib/
    utils.ts
  routes/
  router.tsx
  styles.css
scripts/
  dev.mjs
  logs.mjs
  lib/
    log-tail.mjs
    rotating-log.mjs
refs/
  .gitkeep
```

Keep the generated TanStack Start structure unless a project decision requires a
different boundary.

Shared shadcn/ui primitives live under `src/components/ui/`. Use
`Alert`, `AlertTitle`, and `AlertDescription` for route errors, form errors, and
recoverable user-facing failures instead of ad hoc alert markup.
`src/lib/utils.ts` provides the standard `cn()` helper for composing Tailwind
classes in shared UI primitives.

Product routes and features must use these shared shadcn/ui primitives for
standard controls and interaction patterns. `Button`, `Select`, and the Sonner
`Toaster` are included in the base template. Add other shadcn/ui components to
`src/components/ui` when needed instead of rendering raw browser controls or
duplicating control styles in feature code. `components.json` records the
project-local shadcn/ui configuration.

The root route mounts exactly one `Toaster` with a top-right default position.
Feature code calls Sonner's `toast` API for transient action results,
recoverable asynchronous failures, and notifications. Inline Alert or field
messages remain for blocking content and location-dependent validation only.

## Local Logs

Foreground `scripts/dev.mjs` writes dev server stdout and stderr to
`.tmp/logs/dev.log` and retains `.tmp/logs/dev.previous.log`, capped at 25 MiB
per file. PF-managed background or resident runs use PF's bounded log as the
single persistent source. Use `pnpm run logs` to read a bounded tail and
`pnpm run logs:follow` to consume only new output while debugging.

Logs are local debugging artifacts. They belong under `.tmp/`, stay ignored by
git, and must not be treated as durable documentation.

## Local Reference Material

`refs/` is reserved for local reference repositories, examples, and external code
snapshots used during research. Its contents are ignored by git. Durable project
facts, source code, decisions, and runtime dependencies must live outside
`refs/`.

## Data And API Boundaries

- The current product owns no database, volume, queue, or mutable server-side
  business data. Add persistence only when a real product requirement appears.
- TanStack Query and its Router SSR integration are included in the base.
- Add Drizzle, Clerk, Zod, TanStack Form, TanStack Table, or TanStack Store only
  when the corresponding project capability is selected.
- Add `DATABASE_URL` only for PostgreSQL persistence. SQLite uses an explicit
  application data path owned by the device or local service.
- Keep domain values that affect business correctness in a single source of
  truth.
- Validate required data at system boundaries; do not hide missing required data
  with downstream defaults.

## Production Runtime

- Artifact: public Tencent Cloud TCR Personal Edition OCI image at the Beijing
  endpoint `ccr.ccs.tencentyun.com/opskit/coolify-demo`, pinned by `sha256`
  digest.
- Platform: Coolify Cloud application on the fixed `bj-2c8g` server.
- Architecture: `linux/amd64`.
- Listener: `0.0.0.0:3000`.
- Health: container health check plus `GET /healthz`.
- Release identity: the source commit, region, and public hostname are baked
  into the image through fixed Docker build arguments.
- Public hostname: `coolify-demo.perphq.com` with Cloudflare DNS-only A routing.

## Environment

Environment model: `local_production`

Configured environments:

- `local`
- `production`

PF's local value store is the default authority for registered-project values,
and PF-managed lifecycle commands inject the selected local environment. Keep a
repository-root `.env.local` only when a root loader intentionally owns that
compatibility path. Never create app/package env files in a monorepo. Document
required key names here or in registry metadata, never secret values.

## Validation

Use the narrowest relevant check:

```bash
pnpm run test
pnpm run test:e2e
pnpm run build
pnpm run logs
```

Run browser verification for visible UI changes, routing changes, and critical
user flows.
