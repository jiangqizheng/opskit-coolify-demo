# Decisions

> Status: active
> Purpose: short durable decision log

Record durable product or technical decisions here. Do not record temporary task
notes or failed attempts.

## 2026-06-22 - Use Proj-Factory Web Defaults

- Decision: Start from the TanStack Start web template.
- Reason: It is the default AI-first web product shape for this project.
- Impact: Keep TanStack Start, TanStack Router, TanStack Query, Tailwind CSS,
  Playwright, pnpm, and Portless unless a later project decision changes them.

## 2026-07-26 - Select System Shape

- Decision: Use `hosted_product` with `postgres` persistence and the `local_production` environment model.
- Reason: PF inferred this boundary from the product intent before initialization.
- Impact: Data authority is `server`; storage or deployment changes must preserve this boundary.
