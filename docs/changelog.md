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
