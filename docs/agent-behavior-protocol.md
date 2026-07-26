# Agent Behavior Protocol

> Status: accepted
> Date: 2026-06-22

## Purpose

This is one of the highest-priority protocols for this project. It defines how
AI agents must reason and act while changing code.

The goal is to make agents find the real problem, challenge weak assumptions,
preserve long-term architecture, and avoid hiding bugs behind fallbacks or
compatibility branches.

## Core Contract

Local style and process preferences must not override these invariants:

- solve the real problem and fix the owning boundary;
- preserve explicit user intent, existing project facts, and user changes;
- keep required domain values centralized and validated rather than hidden by
  downstream defaults;
- make only actions authorized by the request and stop before production,
  destructive, costly, external, or materially broader work;
- verify the changed behavior with the most relevant available evidence;
- finish only when the requested outcome is complete or a concrete blocker is
  reported.

The sections below define the decision rules. Do not repeat them in task prompts
unless a task needs a narrower exception or output contract.

## Development Efficiency Priority

Before formal launch, when this project runs in a developer-owned local or
private single-user environment, development efficiency is the highest
priority. Use the shortest reliable path from edit to observable evidence.

Default rules:

- do not add speculative security, privacy, approval, audit, compatibility, or
  abstraction layers without a concrete current risk;
- do not introduce repeated confirmations, password prompts, permission loops,
  or fragile local identities for routine local development;
- prefer direct, reversible local operations over generalized production-style
  control planes;
- keep architecture clean when it reduces current and near-term iteration cost,
  but do not implement hypothetical production requirements early;
- when a safety mechanism materially slows development, compare it against the
  actual present threat model and simplify it if the risk is only hypothetical.

The minimum floor remains mandatory: never expose or commit secrets, never run
unconfirmed destructive or production writes, and never remove required durable
data recovery. Reassess and harden when public/network exposure, external
deployment, shared or multi-user access, real users or production data, or
compliance creates a real boundary.

## Task Execution Contract

Define the destination, evidence, and completion bar before prescribing a long
sequence of steps. Agents may choose the efficient implementation path inside
the following authorization boundary:

- For answer, explanation, review, diagnosis, or planning requests, inspect the
  relevant evidence and report the result. Do not implement changes unless the
  request includes implementation.
- For change, build, fix, or migration requests, make the requested in-scope
  local changes and run relevant non-destructive validation without asking for
  routine approval.
- Require explicit confirmation for production writes, destructive or
  irreversible actions, purchases, external messages or publication, secret
  disclosure, and material expansion beyond the requested scope.
- Ask only for the smallest missing input that changes direction, risk, or
  permission. Otherwise make a documented, reversible assumption and continue.

### Execution Levels

Use the lowest level that truthfully covers the task:

1. **Fast path**: docs, copy, configuration metadata, or a small isolated fix.
   Inspect the owning source, edit directly, run one focused check, and hand off.
   No Session, feature artifacts, browser run, or full build is required unless
   the task changes those boundaries.
2. **Normal path**: a clear multi-file implementation or migration within one
   domain. Use a short working plan when useful, register a Session only when
   conflict or multi-stage continuity justifies it, and validate the affected
   contracts without repeating equivalent commands.
3. **Coordinated path**: parallel agents, cross-domain sequencing, unresolved
   product direction, or a change whose auth, billing, permissions, persistence,
   or external-integration risk benefits from explicit spec and task artifacts.
   Use the central PF Session ledger and the feature workflow only as needed.
4. **Production path**: production writes, destructive or irreversible work,
   secret disclosure or rotation, external publication, or deployment control.
   Prepare an inspect-plan-apply-verify contract and stop for confirmation at
   the real execution boundary.

The number of files, the presence of UI code, or the availability of a broad
validation command does not by itself justify a heavier level.

For multi-step work, give one short preamble before tool use and update the user
only at major phase changes or when evidence changes the plan. Do not narrate
routine calls.

After each retrieval or validation loop, decide whether the core request now has
enough evidence. Stop when the outcome and completion bar are satisfied. If a
required fact is still missing, use the smallest meaningful retrieval or
inspection fallback. This does not authorize a product or data fallback. After
the reasonable evidence sources are exhausted, name the missing evidence and
the blocker instead of guessing or looping for optional detail.

## Truth-Seeking Collaboration

Agents must optimize for truth, correction, and solving the actual problem.

- Do not agree with the user just to be agreeable.
- The user's current view is not automatically correct.
- If there is a mismatch, missing risk, weak assumption, or simpler framing,
  state it clearly and explain the reasoning.
- Give a direct technical recommendation instead of vague optionality.
- When challenging a direction, stay concrete: name the risk, the affected
  files or behavior, and the recommended path.

## Development-Stage Iteration

Before this project is formally launched, development efficiency is the highest
priority. Long-term correctness and clean architecture should reduce future
iteration cost, while compatibility with old intermediate states and
speculative production hardening should not slow the current loop.

- Do not keep old data, old APIs, old test fixtures, or old flows compatible by
  default.
- Do not add complexity for one-time migrations or historical states.
- When removing old modules, fields, or flows, remove them to the intended final
  shape instead of keeping downgrade or compatibility paths.
- Add a compatibility layer only when the user explicitly requires it in the
  current task or when the project has a documented production constraint.

Once production carries real users or real data, production guardrails override
this development-stage default.

## Root-Cause Fixes

When fixing a bug, agents must default to root-cause repair.

Before patching, classify the problem:

- implementation mistake
- missing data boundary
- unclear state model
- API contract mismatch
- product or architecture design problem

Rules:

- Do not stop at the smallest local patch if it only makes the current case
  pass.
- Do not hide structural problems with local workarounds.
- If the root cause is design or architecture, state that clearly and propose a
  refactor path before doing broad changes.
- Fail at the correct boundary instead of silently accepting invalid state.
- Add fallback behavior only when the user explicitly asks for it in the current
  task, or when it is already documented as an intentional product experience or
  resilience strategy.
- When adding an intentional fallback, document its boundary, risk, and cleanup
  condition.

## Domain Values And Magic Strings

Agents must not scatter domain literals through the codebase.

- Do not use magic strings for domain values in schema, route guards, query
  parsers, business state checks, product taxonomy, permissions, billing,
  provider selection, or cross-module contracts.
- Domain literals that can spread across modules or affect correctness must have
  a single source of truth such as a registry, `as const` object, enum-like
  union, parser, or guard.
- Tests for domain behavior must read expected domain values from the same
  source of truth; do not copy mutable product configuration into test
  assertions.
- UI-only local labels may stay local only when they do not affect business
  correctness, routing, persistence, permissions, or shared contracts.

## Test Assertions

Agents must treat negative assertions as exceptional. Most tests should verify
positive contracts and current behavior.

- Do not add tests whose main value is checking that old strings, old fields,
  old UI copy, old routes, or old implementation details are absent.
- Avoid broad source guards built from `not.toContain`, `not.toMatch`, or
  similar string checks unless they protect a real risk boundary.
- Prefer positive behavior assertions that prove the intended user-visible,
  API, state, or data outcome.
- Negative assertions are appropriate when they protect core logic or real risk
  boundaries, including permissions, security, billing, data isolation,
  production write safety, protocol/internal-error leakage, and XSS-sensitive
  output.
- If a negative assertion only documents a retired design, delete it or replace
  it with a positive assertion for the current behavior.

## Simplicity And Directness

Agents must not over-design.

- Start from first principles: identify the real problem, the real constraint,
  and the smallest durable mechanism that solves it.
- Keep project protocols, prompts, docs, APIs, components, and scripts direct
  and obvious.
- Do not generalize from hypothetical future needs during early project stages.
- Do not turn a small workflow into a framework, state machine, provider menu,
  or long questionnaire.
- Ask for user input only when the answer changes direction, risk, or permission
  boundaries. Do not ask for every operational detail up front.
- Use a small working mechanism instead of a generic system that anticipates
  unproven future cases.
- If a rule, abstraction, or prompt field does not clearly reduce future agent
  mistakes, remove it.

## Temporary Files And Caches

Agents must keep temporary files and local caches contained.

- Put all scratch files, temporary reports, local screenshots, one-off logs,
  generated inspection outputs, and experiment artifacts under project-local
  `.tmp/`.
- Put reusable non-source cache data under project-local `.cache/`.
- Do not scatter temporary files in the repo root, `docs/`, source directories,
  or template directories.
- Do not put durable project facts, source code, docs, or required generated
  project state in `.tmp/` or `.cache/`.
- `.tmp/` and `.cache/` should be ignored by git.
- If a temporary artifact becomes durable project context, move the useful
  content into the appropriate durable doc or source file and delete the
  temporary artifact.

## User-Provided Reference Assets

When the user provides screenshots, images, recordings, mockups, benchmark
captures, or other reference material to guide product direction, UI design,
interaction behavior, visual style, or content quality, agents should preserve
the durable reference instead of leaving it only in chat context.

- Save user-provided durable reference assets under
  `docs/reference/assets/<topic>/` with descriptive filenames.
- Add or update a concise reference note under `docs/reference/` that links the
  assets and records the source, relevant product surface, useful patterns, and
  what should not be copied blindly.
- Keep routine verification screenshots, logs, temporary inspection outputs,
  and failed experiments under `.tmp/`; do not promote them unless the user
  clearly intends them as future product or design reference.
- Do not store sensitive, private, licensed, or account-specific screenshots as
  durable docs unless the user explicitly asks and the project has an appropriate
  privacy boundary.
- If the reference is from a local-only codebase, downloaded example, or large
  external snapshot, keep the raw source under gitignored `refs/` and extract
  only durable lessons or selected assets into docs.

### Cross-project reference research (recon)

**recon** (`/Users/jqz/repos/recon`) is the shared local research source of
truth for open-source repos, closed products/sites, and public docs used as
implementation or competitive reference. This project **consumes links**; it
does **not** re-run full research or re-clone shared trees into local `refs/`.

#### Read path

1. Open `/Users/jqz/repos/recon/library/INDEX.md`.
2. Pick a theme (`catalog.yaml` / theme `BRIEF.md`). Unclear domain → also check
   `library/themes/uncategorized/`.
3. Open 1–3 sources: **repo** → `DIGEST.md`; **product/docs** → `BRIEF.md`
   (public evidence only). Enter `checkout/` only when code evidence is required.
4. In this project, record absolute recon paths + adopt/avoid decisions — not a
   second full landscape essay.

#### Write path

5. Missing or stale research lands **in recon** via CLI/skill
   (`pnpm run recon -- source add|research|mark-refreshed` in
   `/Users/jqz/repos/recon`). Theme unclear → **`uncategorized`** (never force
   `ai-gateway` or another product theme).
6. Cite the new recon path from this project. Thin pointers OK; duplicated
   digests are not.
7. Promote when clear: `source move uncategorized <id> <theme>`.

#### Hard rules

- Do not re-clone shared reference trees into this project’s `refs/` when recon
  already holds them.
- Do not invent a parallel research store here for the same objects.
- Project-local `refs/` is only for temporary or project-private snapshots.
- recon is not a runtime dependency; trust is evidence-dated.

Trigger phrases: 找参考、参考项目、竞品、开源实现、对标、官网/产品调研、
有没有现成库.

Skill: `/Users/jqz/repos/recon/skills/recon/SKILL.md`.
Consumption: `/Users/jqz/repos/recon/docs/consumption.md`.

## Fallbacks And Required Fields

Agents must not repair upstream uncertainty by adding downstream defaults.

- Do not layer `??`, `||`, temporary defaults, compatibility branches, or silent
  fallbacks through business flows to mask missing upstream data.
- Required fields should be validated or asserted at the boundary where they
  enter the system.
- If a field is required by design, fail early with a clear error and fix the
  source of the missing value.
- Downstream code should consume shaped, validated values instead of repeatedly
  guessing.
- Presentation fallbacks are allowed only when they are already documented as
  product behavior or explicitly required in the current task. They must not
  affect permissions, billing, persistence, audit, routing, or cross-module
  contracts.

## Frontend UI Copy

Generated products must avoid explanatory UI copy by default.

- Do not add self-explaining helper text when the title, button, group, control,
  placeholder, or state already communicates the action.
- Do not add marketing-style subtitles, onboarding paragraphs, or explanatory
  filler inside product UI.
- Keep only copy that changes user decisions or prevents mistakes, such as
  limits, consequences, pricing, permissions, irreversible actions, errors,
  empty states, and required next steps.
- Use layout, hierarchy, grouping, labels, defaults, and state indicators instead
  of prose.
- If a change adds user-visible explanatory copy beyond labels, buttons, and
  titles, the final handoff should explain why it is necessary.

## Frontend UI Structure

Generated products must avoid card-in-card UI by default.

- Do not put UI cards inside other cards, panels, popovers, sheets, or page
  sections just to create visual hierarchy.
- Do not style page sections as floating cards when a full-width band,
  constrained layout, divider, heading, toolbar, list, tab group, or inline
  group would express the structure more directly.
- Reserve cards for individual repeated items, modals, and genuinely framed
  tools where the border is part of the interaction boundary.
- For dense product surfaces, prefer quieter hierarchy: spacing, alignment,
  typography, separators, and state changes instead of stacked borders,
  shadows, and rounded rectangles.
- If a UI change intentionally nests framed surfaces, the final handoff must
  explain the interaction boundary that makes the nesting necessary.

## Frontend UI Components

Generated products must use shadcn/ui as the default component system for
standard controls and interaction patterns.

- Feature and route code should consume shared primitives from
  `src/components/ui` instead of styling browser controls independently.
- When shadcn/ui provides an equivalent, do not directly render raw controls or
  interaction primitives such as `select`, `button`, `input`, `textarea`,
  `checkbox`, `radio`, `dialog`, `popover`, `tabs`, or `tooltip` in product
  feature code.
- If the needed shadcn/ui component is missing, add it to
  `src/components/ui` first, then reuse that shared primitive. Keep its variants
  and visual states centralized instead of copying classes into feature code.
- Preserve semantic HTML, accessibility, keyboard behavior, and form
  integration through the shared primitive. Using shadcn/ui does not mean
  replacing native semantics with generic elements.
- A direct native control is allowed only when no suitable shadcn/ui component
  exists or when platform-native behavior is an explicit product requirement.
  Record the reason in the implementation or durable project docs when the
  exception affects future UI work.
- Do not add another general-purpose component library alongside shadcn/ui
  without an explicit project decision.

## Frontend Interaction Feedback

Generated products must present transient interaction feedback and notifications
through one consistent global Toast system.

- Mount one shared shadcn/ui Sonner `Toaster` at the application root and keep
  its default position at the top right.
- Use Toasts for user-action results and asynchronous events that do not belong
  to one persistent content region: create, update, delete, copy, import,
  export, background completion, and their recoverable failures.
- Use the appropriate `success`, `error`, `warning`, `info`, or `loading` tone
  instead of implementing feature-local notification boxes.
- Do not place ordinary action success or failure messages inside arbitrary
  page sections, cards, toolbars, dialogs, or forms. This keeps feedback
  location and dismissal behavior consistent across features.
- Keep errors inline only when the location is necessary to understand or fix
  the problem, such as field validation, a failed content region that cannot
  render, or a blocking page-level error. Persistent operational status may also
  remain in its owning region.
- A project may use another position or an inline presentation only when the
  user explicitly requests it or the product records a specific interaction
  reason. Do not create a second Toast provider for the exception.

## Frontend UI Language

Generated projects should default user-facing UI copy to Chinese unless the
user explicitly requests another language for the current project.

- Use the selected UI language consistently for navigation, labels, buttons,
  empty states, validation messages, errors, and product-specific copy.
- Keep internal code identifiers, file names, route names, env keys, and
  developer-only docs in the language that best fits the codebase; this rule is
  about user-visible UI.
- Record any project-specific UI language or locale requirement in
  `docs/context.md`.
- If a project needs multiple UI languages, make that an explicit product
  requirement instead of silently adding a localization framework by default.

## Frontend Product Layout

Generated productivity or efficiency-tool products should default to a
persistent left navigation sidebar with a right-side content workspace.

- Use the sidebar for stable primary navigation, workspace switching, or core
  tool modes.
- Use the right-side content area for the active task, list/detail workflow,
  editor, dashboard, table, queue, or settings surface.
- Keep the layout responsive: collapse or convert the sidebar at narrow mobile
  widths without losing primary navigation.
- Do not force this layout onto marketing pages, public editorial pages, games,
  immersive visual experiences, or product goals that clearly need another
  first screen.
- Record a different default layout in `docs/context.md` or
  `docs/decisions.md` when the product goal requires it.

## Project-To-Factory Feedback

Generated projects are not one-way outputs. Real integration and iteration
should improve `proj-factory` over time, but feedback must be isolated until it
is proven useful.

After integrating `proj-factory` into this project, retrofitting an existing
project, or completing a meaningful project iteration, agents must check whether
the work exposed a reusable problem in the factory protocol, template, prompt,
registry model, env handling, validation, or agent workflow.

- Capture uncertain or single-project feedback in `docs/feedback/inbox.md` in
  `proj-factory` before changing stable protocols, templates, prompts, recipes,
  or registry models.
- Record the source project, date, observed problem, evidence, affected factory
  area, suggested change, status, and promotion criteria.
- Use statuses such as `observed`, `candidate`, `accepted`, and `rejected` so
  future agents can tell whether feedback is only a signal or already a factory
  rule.
- Promote feedback into stable `proj-factory` docs or templates only when it is
  reusable, low-risk, evidence-backed, and has a clear applicability boundary.
- Direct stable updates are allowed only for obvious protocol gaps discovered
  during explicit `proj-factory` integration or retrofit work. The handoff must
  still name the evidence and changed files.
- Do not upstream this project's business rules, branding, product copy,
  temporary implementation details, or failed attempts that do not produce a
  reusable rule.
- If there is no reusable feedback, omit the feedback section from the handoff.

## Production Writes

Production writes require explicit confirmation.

Before executing any production database write, migration, seed, repair,
backfill, env or secret change, OAuth change, DNS change, object storage change,
worker or cron change, or other irreversible production operation, the agent
must stop and restate:

- target environment
- action type
- impact scope
- whether the action is destructive
- validation already completed
- exact command or operation to run
- stop conditions

The operation may proceed only after the user explicitly confirms it in the
current conversation.
