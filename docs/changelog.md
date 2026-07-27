# Changelog

> Status: active
> Purpose: integrated delivery summary

Record completed, integrated changes here. Do not record every implementation
attempt.

## 2026-06-22

- Initialized from the `proj-factory` TanStack Start web template.

## 2026-07-27

- Replaced the starter with a bilingual Coolify delivery demo, `/about`, and a
  structured `/healthz` endpoint.
- Added a multi-stage Node 24 Alpine image for the Beijing amd64 cell, including
  baked release metadata and a container health check.
- Corrected the project contract to stateless persistence and documented the
  fixed OpsKit/Coolify/Cloudflare production acceptance path.
- Selected a dedicated public Beijing TCR repository for immutable release
  images so the Coolify cell can pull without a stored registry secret.
- Replaced the incomplete custom production wrapper with the official Nitro
  Node server output and added browser coverage for hashed stylesheet delivery.
- Replaced the unusable direct Beijing public route with a proxied Cloudflare
  Tunnel to node-local Traefik, including a fixed 308 rule and OpsKit-managed
  checksum-pinned connector contract.
- Updated the public demo and browser acceptance to describe and prove the
  actual Tunnel-based edge path.
- Added a local GitHub Actions release contract for Vercel-like push-to-deploy:
  verify, production-shaped Playwright, GitHub-runner AMD64 build, immutable TCR
  receipt, deploy-only Coolify webhook and exact public release verification.
  The live digest-pinned application and GitHub production secrets were not
  changed; activation remains a separate confirmed migration.
