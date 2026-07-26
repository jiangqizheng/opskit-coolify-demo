<!-- intent-skills:start -->
## Skill Loading

Before substantial changes to TanStack Start, Router, Query, Form, Table, or
another package-specific pattern:
- Run `pnpm run intent:list` from the project or workspace root to see available local skills.
- The wrapper selects the actual TanStack package root (`.` or `apps/web`) and reports missing dependencies before invoking Intent.
- If a listed skill matches the task, run `pnpm run intent -- load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- If the correctly rooted check reports no Intent-enabled packages, continue with project docs and official package documentation; do not treat that result as a reason to install a broad global TanStack Skill.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
- Skip Intent for docs, copy, ordinary CSS, project metadata, and generic scripts
  that do not change a TanStack package contract.
<!-- intent-skills:end -->

## proj-factory Template Context

This project was generated as the v0 primary `proj-factory` web template.

Scaffold command used:

```bash
npx @tanstack/cli@0.69.5 create my-tanstack-app --agent
```

TanStack Intent command to use on demand:

```bash
pnpm run intent:list
pnpm run intent -- load <package>#<skill>
```

Chosen stack:

- TanStack Start
- React
- TanStack Router
- TanStack Query
- TanStack Store as an optional profile for cross-component client workspace state
- TypeScript
- Tailwind CSS
- Vite
- pnpm, chosen for multi-agent worktree efficiency
- Playwright for browser-based verification and screenshots
- Portless for stable local preview URLs
- shadcn/ui source primitives in `src/components/ui`

Keep the generated TanStack Start project structure unless there is a clear
project-specific reason to change it. Before making substantial changes to
TanStack Start, Router, Query, or package-specific patterns, run the Intent skill
list/load flow above and use the package-shipped guidance.

Agent behavior:

- Treat `docs/agent-behavior-protocol.md` as one of the highest-priority project
  rules when that file exists.
- During pre-launch development on developer-owned local environments,
  development efficiency is the highest priority. Prefer the shortest reliable
  edit-run-observe loop and do not add speculative security, privacy,
  compatibility, approval, audit, or abstraction layers without a concrete
  current risk.
- Keep only the non-negotiable floor during that stage: never expose or commit
  secrets, never perform unconfirmed destructive or production writes, and do
  not weaken durable-data recovery. Add broader hardening when deployment,
  public/network exposure, multi-user access, shared machines, real users, or
  compliance creates the corresponding risk.
- Seek truth and solve the real problem; do not agree just to agree.
- Fix root causes instead of symptoms. Use single sources of truth and early
  validation of required data instead of local patches, magic strings,
  downstream defaults, or broad fallback branches.
- For bugs, failing tests, unexpected behavior, or build errors, investigate
  root cause before proposing fixes: read the full error, reproduce it, check
  recent changes, trace data across boundaries, then make one focused fix.
- If two or three attempted fixes do not resolve the issue, stop and question
  the underlying model or architecture before layering on another patch.
- During pre-launch development, use clean architecture to reduce iteration
  cost, not to prebuild hypothetical production controls. Add compatibility
  only when explicitly required in the current task or already documented as a
  production constraint.
- Negative assertions are unnecessary in most cases. Tests should verify
  positive contracts and current behavior by default; use negative assertions
  only for core logic or real risk boundaries such as permissions, security,
  billing, data isolation, production write safety, protocol/internal-error
  leakage, or XSS-sensitive output.
- Start from first principles and do not over-design early. Keep protocols,
  APIs, docs, prompts, and UI direct and obvious; ask users only for inputs that
  change direction, risk, or permission boundaries.
- Put temporary files under project-local `.tmp/` and reusable local caches under
  project-local `.cache/`; do not scatter scratch or cache files through the
  repo.
- Put local reference projects, downloaded examples, and external code snapshots
  under project-local `refs/`. Treat `refs/` as local-only research material:
  do not commit its contents or depend on it at runtime. Prefer **recon** for
  anything another PF project might reuse (see Cross-project reference research).
- When the user asks for 参考项目 / 竞品 / 开源对标 / 官网或产品调研 /
  reference repos: **search recon first**
  (`/Users/jqz/repos/recon/library/INDEX.md` → theme BRIEF → DIGEST/BRIEF).
  **Write new or refreshed research into recon**, not a parallel essay under
  this repo’s `docs/` or a re-clone under `refs/`. This project keeps **guide
  links + adopt/avoid decisions** only. Theme unclear → recon
  `uncategorized` (never force `ai-gateway`). Cite absolute recon paths.
  Skill: `/Users/jqz/repos/recon/skills/recon/SKILL.md`.
- When the user provides product, UI, interaction, or visual reference material
  meant to guide future work, preserve it under `docs/reference/assets/` and add
  or update a concise note under `docs/reference/` with the source, related
  surface, useful patterns, and what not to copy blindly.
- Do not add self-explaining UI copy. Keep only decision-critical or
  mistake-preventing copy.
- Do not design card-in-card UI. Use spacing, dividers, typography, tabs,
  lists, and toolbars for hierarchy instead of nesting bordered or shadowed
  cards inside other cards, panels, popovers, or page sections.
- Default new projects to Chinese user-facing UI copy unless the user
  explicitly requests another language. Record project-specific UI language or
  locale requirements in `docs/context.md`.
- For productivity or efficiency-tool products, default to a persistent left
  navigation sidebar with a right-side content workspace unless the product goal
  clearly calls for another layout.
- Keep client state ownership explicit: TanStack Query owns server/cache state,
  TanStack Router owns URL/navigation state, and TanStack Store may be added for
  client-only workspace state that crosses component or feature boundaries. Do
  not build a generic global data center or copy API responses into a store.
- Use shared shadcn/ui primitives from `src/components/ui` for common UI
  states. Persistent contextual and route-level errors should use the shared
  alert component instead of ad hoc warning markup.
- Use shadcn/ui primitives for standard controls and interaction patterns. When
  shadcn/ui provides an equivalent, do not render raw browser controls such as
  `select` directly in route or feature code. Add a missing component to
  `src/components/ui` first, then reuse it.
- Use the single root-mounted shadcn/ui Sonner toaster for transient action
  feedback, recoverable asynchronous failures, and notifications. Keep it at
  the top right; use inline errors only for field validation or blocking content
  regions unless the user explicitly requests another presentation.
- Harden UI changes against real content: long text, empty data, loading,
  network/API errors, permission states, mobile widths, text zoom, and dark mode.
- Keep UX copy specific and actionable. Error messages should explain what
  failed and, when possible, what the user can do next.
- Route loaders should await only navigation-critical data: authentication,
  permissions, route identity, and facts without which the destination shell
  cannot truthfully render. Load provider inventory, balances, health probes,
  optional enrichment, and runtime observations with TanStack Query or a
  component-owned request that has an explicit loading/error region and a
  bounded network timeout. Awaiting non-critical live checks in the loader
  keeps the previous page visible for seconds after navigation and looks broken.
- Stop for explicit confirmation before production writes or migrations,
  destructive or irreversible local operations, production env changes, secret
  disclosure or rotation, DNS or object storage mutations, worker/cron changes,
  or other production control-plane operations. Routine reversible local
  migrations and ignored local env configuration may proceed when already in
  scope.

Development startup:

- **PF-managed Agent default:** start or reuse the declared runtime with
  `pf ensure <project>` (background development session + env injection + Portless
  when configured). Check `pf status <project>`. Stop with `pf stop <project>`.
- **Human foreground (optional):** `pf dev <project>` for terminal-owned interactive
  debugging, or `pnpm run dev` from the project root when intentionally working
  outside the PF control plane.
- `pnpm run dev` runs Portless with `portless run --force` (owner-scoped stale-route
  cleanup) then the portless `script` (usually `dev:app` / `scripts/dev.mjs`).
- Foreground `scripts/dev.mjs` keeps current and previous output in
  `.tmp/logs/dev.log` and `.tmp/logs/dev.previous.log`, capped at 25 MiB each.
  PF-managed background or resident runs use PF's bounded log only and do not
  persist a duplicate project-local copy.
- **Agent logs and diagnosis:** use `pf logs <project>[/<unit>] --lines 200 --json`
  and `pf diagnose <project>[/<unit>] --lines 200 --json`. Omit the unit when the
  project has one default unit. Do not guess PF control-plane log paths.
  `pnpm run logs` / `pnpm run logs:follow` only apply to foreground project-local
  log files, not PF-captured background logs.
- Check recent logs before guessing about runtime errors. Do not commit `.tmp/`
  logs or paste secrets from logs into chat or docs.
- Managed project ports start at `9030`; do not default to common ports such as
  `3000`, `5173`, or `8080`.
- Override with `PORT=xxxx pnpm run dev:app` only when debugging the app server
  script itself. **Agents must not** background `pnpm run dev:app` / `vite dev`
  (or equivalent) to bypass PF process ownership and env injection.
- Keep `portless.json` `name` / `appPort` aligned with the proj-factory registry.
  Keep `script` set to `dev:app` unless the project changes its app startup command.
- Do not bypass this with a direct `vite dev` command unless debugging the dev
  script itself.

Parallel agent development:

- Use git worktrees when multiple agents work on this project in parallel.
- Do not let multiple implementation agents share this checkout.
- Treat `main` as the source of truth. Keep agent branches short-lived and merge
  completed work back to `main` quickly after validation.
- Start new worktrees from current `main`.
- Each worktree needs its own branch, Portless slug, assigned port, dependencies,
  and project-local cache.
- Keep each agent inside its declared ownership scope. If a task needs files
  outside that scope, extend the PF claim before editing.
- Before write-capable work, inspect current activity with
  `pf work status --project <project>`. Register only when the task may
  conflict or is expected to continue across multiple stages.
- When multiple Sessions have a real dependency order, create one coordination
  group and add narrow planned tasks with `pnpm run agent -- plan add`. Keep
  independent work as ordinary Sessions instead of manufacturing dependencies.
- Start a planned Session only when its projected task status is `ready`. PF
  inherits the task goal, ownership, references, and validation; do not restate
  a divergent local copy.
- After an upstream planned Session completes, use
  `pnpm run agent -- receipt <session-id> --json` for its outcome, validation,
  artifacts, and scoped Git change evidence before starting dependent work.
- Use `pf work start` for required claims, `pf work scope add` before expanding
  writes, and `pf work finish` only after temporary branch integration and
  integration validation.
- Personal Todo files and their status never authorize Agent execution.
- Avoid repeated full builds from every agent. Use targeted validation during
  inner-loop work, then run full validation before integration.

Environment variables:

- Read the generated project's recorded system shape before adding storage or
  environment branches. Hosted systems normally use PostgreSQL with local and
  production configuration. Device applications normally use SQLite in the
  platform application data directory. A local authoritative service may keep
  real long-lived local data and must not be treated as disposable.

- The base template does not require any environment variables.
- Generated projects should document required key names in project docs or the
  `proj-factory` registry, without writing secret values.
- PF's local value store is the default authority for registered-project values;
  PF-managed lifecycle commands inject the selected local environment into the
  process.
- Retain a repository-root `.env.local` only when an existing root loader
  intentionally owns that compatibility path. In monorepos, do not create
  `apps/*/.env.local` or `packages/*/.env.local`.
- Follow the recorded `env.model`: only `local_production` implies both `local`
  and `production`; local-authoritative, device-local, and local-tool projects
  normally declare only `local`.
- Do not generate `.env.example`, `.env.production`, `.env.staging`, or similar
  env files by default.

Deployment notes:

- This template keeps the default TanStack CLI toolchain.
- Add a deployment target only when the generated project chooses one.
- Record deployment-specific adapters, runtime constraints, and env bindings in
  the generated project's docs.

Known gotchas:

- TanStack Start is currently selected deliberately as the default web template
  for SSR-capable AI-assisted product development.
- `src/routeTree.gen.ts` is generated by the TanStack Start Vite plugin during
  dev and build. Do not run the standalone `tsr generate` command: it does not
  add Start's registration footer and leaves the generated file incomplete.
- Do not guess current TanStack patterns when Intent or package docs can provide
  them.
- Do not copy large legacy project skill directories into this project by
  default. Install optional agent skills only when this project actually needs
  that capability, and record the reason and boundary in `AGENTS.md`,
  `docs/workflow.md`, or `docs/decisions.md`.
- Keep durable project decisions in `AGENTS.md` and project docs so future AI
  agents can continue from the same context.

Documentation and agent state:

- Keep long-lived facts in a small durable doc set: `docs/context.md`,
  `docs/architecture.md`, `docs/workflow.md`, `docs/decisions.md`, and
  `docs/changelog.md` when those files exist.
- Use `refs/` for local reference repositories or examples that help agents
  inspect patterns during implementation. Keep those files gitignored and copy
  durable lessons into docs or source instead of linking project behavior to
  `refs/`.
- Do not create a new version or plan document for every small vibe-coding
  iteration.
- For parallel work, use a short-lived central PF Agent Session instead of
  project-local Session files or one shared current-plan file.
- Update durable docs only when product facts, architecture, workflow, or
  important decisions change. Routine implementation progress should be
  summarized after integration in `docs/changelog.md`.
- Use `docs/initiatives/current.md` only for larger coordinated changes that
  need multiple agents, sequencing, high-risk migration, auth, billing,
  permissions, production data, or deployment planning.

Next steps for generated projects:

- Replace starter branding and routes with the product-specific surface.
- Add product docs under `docs/`.
- Register the generated project in the `proj-factory` relationship index.
- Add env requirements only when the product actually needs providers or
  secrets.
- If the product needs external AI capabilities such as translation, TTS, ASR,
  image generation, OCR, embeddings, reranking, or structured extraction, check
  `/Users/jqz/repos/rskit/docs/ai-capabilities.md` and the rskit capability
  registry before adding provider-specific code. Record adopted rskit
  capabilities, provider/model choices, env key names, and validation commands
  in durable project docs without secret values.

Verification:

- For a local browser session on a PF-managed project, prefer `pf ensure <project>` then open the Portless preview URL or `http://127.0.0.1:<port>/`. Use `pnpm run dev` only for intentional foreground work outside PF.
- Use `pnpm run verify` as the standard full code validation contract: route-tree
  stability, build, typecheck, and unit tests. Do not follow it with an
  equivalent standalone build unless another surface needs coverage or the
  build is being diagnosed.
- For docs, copy, or metadata-only changes, use focused consistency checks and
  `git diff --check`; a full verify is not required.
- Use `pnpm run test:e2e` for changed user-visible behavior, routing, or critical
  interactions. Use Playwright before interactive browser tooling unless the
  task needs an existing browser profile, extension, or logged-in session.
- Set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:<port>` to point Playwright at an
  already-running server. Set `PW_SKIP_WEBSERVER=1` only when the server is
  already running and has been checked directly.
- Use `pnpm run preview:check` when Portless returns 502 or the preview URL does
  not match the direct app port. If the fixed port works and Portless fails,
  treat it as preview plumbing until logs show an app error.
- Before browser verification, identify the target route, required state,
  identity or guest mode, and pass condition. If those are unclear, inspect code
  and docs before launching a browser.
- If two browser attempts fail in different ways, stop clicking and collect
  evidence from logs, route/API responses, cookies/session state, and port
  ownership before trying another browser path.
- Prefer role-based Playwright locators and user-visible assertions. Avoid
  fixed sleeps; wait on observable UI conditions.
- Prefer positive behavior assertions. Do not add `not.toContain`,
  `not.toMatch`, broad source guards, or old-design absence checks unless they
  protect core logic or a real risk boundary.
- Vitest discovery is bounded by `vitest.config.ts`. Keep unit/component tests
  under `src` or `tests/unit`, Playwright specs under `tests/e2e`, and local
  reference repositories under `refs/` outside test discovery.
- Install the Chromium browser once with `pnpm run playwright:install` when the
  local environment does not already have it.
- Inspect Playwright screenshots when visual layout or appearance is part of the
  acceptance criteria, including changed route error and not-found surfaces.
