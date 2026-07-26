# Agent Workflow

> Status: draft
> Purpose: how AI agents work on this project

## Read First

Before changing code, read:

- `AGENTS.md`
- `docs/agent-behavior-protocol.md`
- `docs/context.md`
- `docs/architecture.md`
- `docs/workflow.md`

## Behavior Rules

`docs/agent-behavior-protocol.md` is one of the highest-priority project rules.
Follow it before local convenience or short-term delivery speed.

## Optional Agent Skills

Do not copy large skill directories from other projects into this project by
default. Use the built-in template rules first.

Install or copy an optional agent skill only when the project has a real active
need for that capability, such as payments, programmatic SEO, browser
automation, specialized design review, or a provider-specific SDK workflow.

When adding an optional skill, record:

- why the project needs it
- where the skill came from
- when agents should use it
- which project-specific assumptions should not spread beyond that boundary

TanStack package guidance follows a separate project-local path. Before
substantial Start, Router, Query, or related work, run:

```bash
pnpm run intent:list
pnpm run intent -- load <package>#<skill>
```

The wrapper runs from the actual TanStack package directory and reports when
dependencies have not been installed. A correctly rooted empty result does not
justify installing a broad global TanStack Skill; use project docs and official
package documentation unless a reviewed project-scoped capability fills a real
recurring gap.

## External AI Capabilities

When this project needs external AI capabilities, check `rskit` before adding
provider-specific code.

Use `/Users/jqz/repos/rskit/docs/ai-capabilities.md` and the rskit capability
registry to find available capabilities, provider/model choices, env key names,
recipes, adapter snippets, packages, or service boundaries.

Record the adopted capability, provider/model, required env key names, and
validation commands in this project's durable docs. Do not store secret values.

## Debugging

For bugs, failing tests, unexpected behavior, or build errors:

1. Read the full error and relevant stack trace.
2. Reproduce the issue with the smallest reliable command or browser path.
3. Check recent changes and relevant logs with `pnpm run logs`.
4. Trace data across the boundary where the failure appears.
5. Make one focused root-cause fix, then rerun the failing check.

Do not stack multiple speculative fixes. If repeated fixes reveal new failures in
different layers, stop and reconsider the architecture or state model.

## Local Preview

**PF-managed Agent default:**

```bash
pf ensure <project>
pf status <project>
```

Open the Portless preview URL (or `http://127.0.0.1:<appPort>/`). Stop with
`pf stop <project>`.

**Human foreground (optional):**

```bash
pf dev <project>
# or, when intentionally outside PF:
pnpm run dev
```

`pnpm run dev` starts Portless and the app server on the assigned fixed port.
Portless uses `portless run --force` to reclaim a stale same-name route with
owner-scoped cleanup before the app script runs. The app script then handles a
stale process on the assigned TCP port.
Foreground dev server output is retained in `.tmp/logs/dev.log` and
`.tmp/logs/dev.previous.log`, capped at 25 MiB each. PF-managed background and
resident runs keep one bounded PF-owned log instead of writing a duplicate
project-local copy.

**Agent logs and diagnosis:**

```bash
pf logs <project>[/<unit>] --lines 200 --json
pf diagnose <project>[/<unit>] --lines 200 --json
```

Omit the unit when the project has one default unit. Do not guess PF
control-plane log paths. `pnpm run logs` / `pnpm run logs:follow` only read
foreground project-local logs.

Agents should check recent logs before guessing about local runtime failures.
Logs are temporary local artifacts under `.tmp/` or PF capture paths; do not
commit them or copy secret values from them into chat or docs.

Use direct app startup only when debugging the app script or preview plumbing:

```bash
pnpm run dev:app
```

**Agents must not** background `pnpm run dev:app` / `vite dev` to bypass PF
ownership and env injection.

## Reference Material

Use `refs/` for local reference projects, downloaded examples, and external code
snapshots that help agents compare implementation patterns. The directory is
local-only research material: its contents stay gitignored, and project behavior
must not depend on files inside it.

When the user provides product, UI, interaction, visual, or content-quality
reference material that should guide future work, save the durable assets under
`docs/reference/assets/<topic>/` and add or update a concise reference note under
`docs/reference/`. Keep routine verification screenshots and temporary
inspection output under `.tmp/`.

## Validation

- Use `pnpm run verify` as the standard full code contract for route-tree
  stability, build, typecheck, and unit tests. TanStack Start's Vite plugin owns
  `src/routeTree.gen.ts`; verify fails if build updates it. Do not invoke the
  standalone Router CLI because it omits the Start-specific registration footer.
- For docs, copy, or metadata-only changes, use focused consistency checks and
  `git diff --check`; a full verify is unnecessary.
- Use `pnpm run test` for unit/component tests.
- Use `pnpm run test:e2e` for browser smoke verification.
- Use Playwright for changed user-visible behavior, routing, or critical
  interactions. Use interactive browser tooling only when the task depends on
  an existing browser profile, extension, or logged-in session.
- Set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:<port>` when validating an existing
  dev server. Set `PW_SKIP_WEBSERVER=1` only after checking that server directly.
- Use `pnpm run preview:check` when the Portless URL returns 502 or disagrees
  with the fixed direct app port.
- Do not run `pnpm run build` immediately after a successful `pnpm run verify`
  unless another surface needs coverage or the build is being diagnosed.
- Inspect browser output or Playwright screenshots when visual behavior is part
  of the acceptance criteria.

Before browser verification, write down the target route, required state,
identity or guest mode, and pass condition. Keep the browser path short. If two
browser attempts fail in different ways, stop and collect logs, route/API
responses, cookies/session state, and port ownership instead of continuing to
click.

Playwright tests should prefer role-based locators and user-visible assertions.
Avoid fixed sleeps; wait for observable UI state instead.

## Error UI

Use the shared shadcn/ui alert primitive in `src/components/ui/alert.tsx` for
persistent contextual errors. Route-level failures and 404s are handled in
`src/routes/__root.tsx`; blocking feature regions may reuse the same primitive
instead of creating one-off warning boxes.

Error copy should be concise, specific, and actionable. Say what failed and what
the user can do next when there is a useful recovery action.

## UI Components

Use shadcn/ui as the default component system. Route and feature code should
import shared primitives from `src/components/ui`. The base includes `Button`,
`Select`, and the alert family; add missing shadcn/ui primitives to that
directory before using them in product code.

Do not directly render raw browser controls such as `select` when shadcn/ui has
an equivalent. Keep semantic HTML and accessible keyboard behavior through the
shared primitive. Use a direct native control only when no suitable component
exists or platform-native behavior is an explicit product requirement, and
record any durable exception.

## Interaction Feedback

The application root mounts one shared shadcn/ui Sonner `Toaster` from
`src/components/ui/sonner.tsx`. Its default position is the top right. Use
Sonner's `toast.success`, `toast.error`, `toast.warning`, `toast.info`, or
`toast.loading` API for transient action results, recoverable asynchronous
failures, and notifications.

Do not add feature-local Toast providers or scatter ordinary success and error
messages through page content. Keep a message inline only when its location is
required for recovery, such as field validation, an unrenderable content
region, or a blocking page-level error. A different presentation requires an
explicit user request or documented product reason.

## UI Hardening

Before handoff on visible UI changes, check:

- long labels, names, and generated text
- empty, loading, error, permission, and offline or failed-network states
- narrow mobile widths and 200% text zoom
- keyboard focus and visible focus states
- light and dark themes
- touch targets and text overflow

## Parallel Agents

Do not run multiple implementation agents in the same checkout.

For parallel work:

1. Inspect current work with `pf work status --project <project>`.
2. Start a central PF Session; PF creates a separate git worktree and branch and
   assigns a unique port and Portless slug.
3. Keep each agent inside its declared ownership scope. Run
   `pf work scope add <id> <path>` before expanding writes.
4. Integrate PF-created temporary branches from the main checkout or an
   integration worktree and run integration validation.
5. Use `pf work finish` with a concise outcome. Merge or validation failures
   remain blocked; there is no review-wait state.

Use:

```bash
pnpm run agent -- start <id> --goal "<goal>" --owns "src/path/**"
pnpm run agent -- status
pnpm run agent -- finish <id> --outcome "<result>" --validated "<command>"
```

## Durable Docs

Update durable docs only when long-lived facts change:

- `docs/context.md` for product facts
- `docs/architecture.md` for technical boundaries
- `docs/workflow.md` for workflow changes
- `docs/decisions.md` for durable decisions
- `docs/changelog.md` after integration

Do not create a new version document for every small iteration.

Use `docs/initiatives/current.md` only for large coordinated changes that need
multiple agents, sequencing, high-risk migration, auth, billing, permissions,
production data, or deployment planning.

## Production Guardrail

Before any production write or migration, destructive or irreversible local
operation, production env change, secret disclosure or rotation, or production
control-plane mutation, stop and restate the target environment, action type,
impact scope, destructiveness, validation, exact command, and stop conditions.
Routine reversible local migrations and ignored local env configuration may
proceed when already in scope.
