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

- Decision: Use `hosted_product` with no persistence and the
  `local_production` environment model.
- Reason: This project proves stateless delivery and owns no mutable business
  data; the initial PostgreSQL profile was an incorrect scaffold inference.
- Impact: Runtime state is derived from the immutable image. Do not provision a
  database, volume, backup contract, or migration path unless the product scope
  changes.

## 2026-07-27 - Publish One Immutable AMD64 Image From Beijing TCR

- Decision: Publish a public Tencent Cloud TCR Personal Edition image from the
  Beijing endpoint for `linux/amd64`, pin Coolify to its OCI digest, and bake
  source release, region, and hostname into the artifact.
- Reason: The Beijing cell should only pull and run an already verified image.
  A same-region public repository keeps the pull path short and avoids storing
  a long-lived registry credential in Coolify.
- Impact: Every release starts from a clean Git commit, and OpsKit verifies the
  registry digest, Coolify configuration, public HTTPS, and `/healthz` as one
  contract.
