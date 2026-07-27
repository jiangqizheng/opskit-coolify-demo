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

## 2026-07-27 - Use Nitro For The Node And Docker Runtime

- Decision: Build TanStack Start with the Nitro Vite plugin and run the
  generated `node-server` entry from `.output/server/index.mjs`. Copy only the
  self-contained `.output` directory into the runtime image.
- Reason: The first custom Node wrapper forwarded SSR requests but did not own
  hashed client assets, so the public HTML rendered without CSS or hydration
  bundles. Nitro is the package-supported Node/Docker deployment boundary and
  keeps static serving aligned with the Start build manifest.
- Impact: `pnpm run build` now proves the deployable server bundle, `pnpm start`
  runs that exact output, and Playwright verifies both stylesheet delivery and
  computed styling before a release image can be promoted.

## 2026-07-27 - Put The Beijing Cell Behind Cloudflare Tunnel

- Decision: Route `coolify-demo.perphq.com` through a proxied Cloudflare CNAME
  and a remote-managed Tunnel whose connector forwards to node-local Traefik
  over HTTPS. Keep HTTP-to-HTTPS as one hostname-scoped 308 rule.
- Reason: The Beijing node's direct public HTTP/HTTPS path is intercepted for
  this hostname even though Traefik and the application are healthy locally.
  Tunnel provides a reproducible outbound connector path without exposing the
  Coolify control plane or changing the application contract.
- Impact: OpsKit owns Tunnel configuration, DNS, redirect policy and the
  checksum-pinned cloudflared container as one inspect/plan/apply/verify
  contract. The fixed Tunnel identity is not recreated silently; identity
  loss blocks until the contract is deliberately updated.

## 2026-07-27 - Use GitHub Actions As The Build Plane

- Decision: Make a push to `main` start the project-owned verification, AMD64
  image build, TCR publication, Coolify deployment trigger and public release
  verification. Keep build workloads off the Beijing runtime cell.
- Reason: This is the closest maintainable Vercel-like path for many projects
  while preserving the existing same-region registry and immutable artifacts.
  Coolify officially supports GitHub Actions publishing a prebuilt image and
  invoking an application deploy webhook.
- Impact: GitHub production configuration needs a repository-scoped TCR push
  credential, application webhook and deploy-only Coolify token. Every build
  retains an immutable commit tag and digest-bearing receipt; the mutable
  `main` tag is only a deployment channel. Full Coolify write credentials do not
  enter project repositories. Activation remains blocked until the live app and
  OpsKit reconciliation contract are migrated together.
