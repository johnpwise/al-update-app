# AGENTS.md

This app inherits shared workflow rules and React stack guidance from:

- `.github/agents/agents-core/AGENTS.md`
- `.github/agents/react-stack-pack/AGENTS.md`

## Project Facts

- Stack: React 19 + TypeScript + Vite
- Routing: none (single-page app, no router library)
- Local/shared state: React local state/hooks only (no Zustand or other client-state library)
- Server-state: none (data is loaded from static local JSON: `src/entries.json`, `src/data/calendar-2026.json`)
- HTTP boundary: none (no network/HTTP client in use)

## capability_owners

- `local_ui_state_owner`: React local state/hooks

## test_layer_matrix

- `unit`: N/A — no test runner configured in `package.json`
- `component`: N/A — no test runner configured in `package.json`
- `integration`: N/A — no test runner configured in `package.json`
- `e2e`: N/A — no test runner configured in `package.json`

### Working model

Agents should behave like junior developers being trained into this workflow.

That means agents are expected to:

* follow the established rules instead of improvising
* ask before making higher-risk or higher-scope changes
* justify decisions when introducing new structure or complexity
* prefer consistency, maintainability, and type safety over speed hacks

This is a prescriptive project. When in doubt, follow the documented standard rather than inventing a new pattern.

### Agent instruction sources

Agent guidance in this repo is sourced from:

1. root `AGENTS.md` (authoritative repo rules)
2. `.github/agents/react-stack-pack/AGENTS.md` and `.github/agents/react-stack-pack/agent-docs/...` (React stack baseline)
3. `.github/agents/agents-core/AGENTS.md` and `.github/agents/agents-core/agent-docs/...` (core workflow baseline)

When guidance conflicts, earlier items in this list take precedence.

### Workflow inheritance sync

This repo inherits workflow defaults from `.github/agents/agents-core` and `.github/agents/react-stack-pack`.
This overlay should document repo-specific facts, explicit local overrides, and approval boundaries only.

### Coding standards inheritance

Coding standards for generated React code/tests are inherited from:

- `.github/agents/react-stack-pack/agent-docs/standards/coding/*.md`
- applicable quality/workflow constraints from `.github/agents/agents-core/AGENTS.md` and `.github/agents/agents-core/agent-docs/...`

### Policy ownership map

* `agents-core`: stack-neutral workflow governance, fail-closed mechanics, handoff/checkpoint contract, and test-evidence lifecycle.
* `react-stack-pack`: React workflow triggers/gates plus React API/state/testing coding conventions.
* root `AGENTS.md`: project-specific runtime/tooling facts, architecture direction, local conventions, and concrete capability/test-tool mapping.

### Local workflow override

* Workflow artifacts must be persisted in `.agent-workflows/<workflow_id>/` for file-first routing.
* After workflow status is `closed`, `.agent-workflows/<workflow_id>/` must be deleted to avoid artifact buildup.
* No test runner is configured yet; if a workflow requires `required_preimplementation_tests` for `unit`/`component`/relevant `integration` layers, adding the minimal test tooling needed to satisfy that requirement is in scope for that slice.

### Inherited workflow defaults (no local override)

* `workflow-orchestrator` remains the active workflow owner.
* Feature workflow entry requires a leading `New Feature` trigger.
* Bug workflow entry requires a leading `Bug Fix` trigger.
* Triggered requests run in fail-closed mode until `.agent-workflows/<workflow_id>/index.md` and the first Worker Prompt Package artifact are persisted.
* In fail-closed mode, the first response must report workflow ownership/routing state, not direct implementation edits.
* Every non-`workflow-orchestrator` specialist return must use the core Template-Based Handoff template.
* Default `Return To Agent` is `workflow-orchestrator.agent.md` unless an incoming handoff explicitly overrides it.
* After each accepted specialist handoff, continue specialist chaining directly when routing metadata is `workflow_status: in-progress` and `reentry_reason: none`; otherwise re-enter `workflow-orchestrator`.
* `feature-plan-delivery-orchestrator` classifies `trivial` vs `non-trivial` for both feature and bug workflows.
* `frontend-code-reviewer.agent.md`, `accessibility-ux-reviewer.agent.md`, and `react-component-composition-reviewer.agent.md` are required pre-closeout gates for frontend code changes.
* `api-contract-modeling.agent.md` and `react-state-ownership-guardian.agent.md` are conditional risk-triggered pre-closeout gates for frontend code changes.
* Blocking review findings must route scoped rework to `implementation-engineer` and then rerun required review gates.
