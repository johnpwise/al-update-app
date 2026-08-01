# React Stack Pack - AGENTS.md

This document defines reusable React-stack guidance that can be inherited by React repositories on top of the shared core agent pack.

Repo-local `AGENTS.md` files should add project facts, exceptions, and approval boundaries. They should not repeat stack-wide policy unless the repo intentionally overrides it.

## 1. Scope

This stack pack targets modern React applications and internal tools using:

- React 19+
- strict TypeScript
- component and hook based architecture
- a layered client boundary between UI, state, and API/service concerns
- behavior-first testing
- accessibility-aware delivery

This pack is appropriate for:
- admin dashboards
- line-of-business tools
- CRUD-heavy UIs
- hybrid page/component architectures
- feature-oriented frontends

## 2. Defaults

Unless a repo-local overlay says otherwise, agents should assume:

- React functional components and hooks only
- strict TypeScript
- local state by default
- server state separated from client UI state
- composition over inheritance
- minimal diffs
- behavior-first tests
- semantic HTML first
- no `any`
- no speculative abstractions
- inherit core capability ownership and test-first evidence policy from `agents-core`
- follow the canonical frontend state-ownership ladder from `agents-core/agent-docs/standards/architecture/frontend-state-ownership-standards.md`
- feature workflow entry requires a leading `New Feature` trigger
- bug workflow entry requires a leading `Bug Fix` trigger
- requests using these React-stack triggers run in fail-closed mode until `.agent-workflows/<workflow_id>/index.md` and the first Worker Prompt Package artifact are persisted
- in React-stack fail-closed mode, the first response must report workflow ownership and routing state, not direct implementation
- in React-stack fail-closed mode, if trigger format or routing metadata is incomplete, request a correctly formatted reissue before code changes
- use `agent-docs/workflows/feature-workflow-routing.md` for feature routing and `agent-docs/workflows/bug-workflow-routing.md` for bug-fix routing overlays
- return specialist output as a **Template-Based Handoff** using the core handoff template path
- default `Return To Agent` is `workflow-orchestrator.agent.md` unless incoming handoff explicitly overrides it
- keep workflow entry through `workflow-orchestrator`; after intake dispatch, specialists may chain directly from specialist handoff routing metadata
- after saving a specialist handoff artifact, specialists must emit a completion block with absolute handoff path and continue-workflow line (to next specialist for `in-progress` chaining, or to `Workflow-Orchestrator` for reentry)
- after each accepted specialist handoff, continue specialist chaining directly when routing metadata is `workflow_status: in-progress` and `reentry_reason: none`; otherwise re-enter `workflow-orchestrator`
- for frontend code changes, `Frontend-Code-Reviewer` (`frontend-code-reviewer.agent.md`) is a required pre-closeout gate
- for frontend code changes, `Frontend-Accessibility-Ux-Reviewer` (`accessibility-ux-reviewer.agent.md`) is a required pre-closeout gate
- for frontend code changes, `Frontend-React-Component-Composition-Reviewer` (`react-component-composition-reviewer.agent.md`) is a required pre-closeout gate
- if a required reviewer returns blocking findings, `workflow-orchestrator` must route scoped rework to `implementation-engineer` and rerun required review gates
- after required/triggered reviewer gates pass, `workflow-orchestrator` must route to `commit-authoring-operator` before closeout
- `commit-authoring-operator` invokes the portable `commit-and-push` skill; it must push successful commit(s) and return push command evidence (remote + branch/ref)
- `ready-for-closeout` is valid once `commit-authoring-operator` returns with commit SHA(s) and push-success evidence; PR creation is never required for closeout
- `pull-request-author-operator` runs only on an explicit, separate PR request recognised per the shared trigger-recognition standard in `agents-core/AGENTS.md`; it is never dispatched automatically after commit-and-push
- when explicitly requested, `pull-request-author-operator` must open a live GitHub PR and return PR URL/number evidence; artifact-only PR output is non-compliant for that request
- when explicitly requested, live PR creation should try `gh pr create` first, then fallback to GitHub REST API via `curl` + token; if both fail, route that PR request `blocked` or `awaiting-approval` without reopening an already closeout-ready workflow

## 3. State model

Inherit the canonical decision ladder from `agents-core/agent-docs/standards/architecture/frontend-state-ownership-standards.md`.

Apply these React-specific mappings when setting frontend capability ownership:

1. `capability_owners.local_ui_state_owner`: local component state for component-local UI concerns
2. `capability_owners.shared_client_state_owner` with `capability_owners.shared_client_state_tier: subtree`: use context/lifted tree state when ownership naturally spans a subtree and prop composition becomes noisy
3. `capability_owners.shared_client_state_owner` with `capability_owners.shared_client_state_tier: cross_feature`: use broader store-based client state only for durable cross-page or cross-feature concerns
4. `capability_owners.server_state_owner`: dedicated server-state tooling for async remote data

Do not:
- duplicate server-fetched data into client stores without a strong reason
- use global state to avoid prop drilling prematurely
- persist temporary UI state globally unless the behavior truly spans navigation or sessions

## 4. API and data boundaries

Frontend code should prefer:

- service modules for remote calls
- typed boundary contracts
- explicit separation between transport DTO shapes and domain/UI-facing models when transport shape is not UI-safe
- mapping or normalization only when it reduces ambiguity
- explicit mapper naming patterns (for example: `mapXDtoToX`, `mapXToXDto`) when mapping is needed
- components consuming stable, frontend-safe shapes

Do not:
- call HTTP clients directly from components
- let transport uncertainty leak deeply into UI code
- blur DTO, domain, and UI-facing shapes into a single catch-all model
- hide type mismatches behind broad casts

## 5. Styling and accessibility

Use the repo's chosen styling system, but new work should generally follow:

- component-local styling ownership
- reusable primitives only when reuse pressure is real
- semantic controls before ARIA
- keyboard-operable flows
- clear loading, empty, error, disabled, and success states

## 6. Testing

This stack inherits the mandatory test-first lifecycle from `agents-core`.

React-specific testing guidance:

- start with the smallest failing test for missing behavior
- prefer component/integration tests over implementation-coupled tests
- for `*.component.test.tsx` formatting, AAA annotation/spacing, and required co-location rules, follow `agent-docs/standards/coding/component-test-file-coding-standards.md`
- for `*.unit.test.ts` formatting and AAA annotation/spacing rules, follow `agent-docs/standards/coding/unit-test-file-coding-standards.md`
- for Cypress test formatting and AAA annotation/spacing rules, follow `agent-docs/standards/coding/cypress-test-file-coding-standards.md`
- add unit tests for isolated transformation or branching logic where justified
- plan `e2e` coverage early and author/finalize it when the vertical flow exists
- discourage snapshot tests by default; prefer behavior-focused assertions
- preserve existing regression tests by default; do not alter or weaken them for new feature work or bug fixes unless the intended behavior contract is changing or the test is wrong/brittle
- only use snapshots when output is stable and presentation-heavy and the snapshot adds real signal

## 7. Agent collaboration

The shared core prompt/orchestration agents remain the workflow authority.
`workflow-orchestrator` dispatches initial/reentry **Worker Prompt Packages** and stack specialists return **Template-Based Handoffs** with chain routing metadata.

This React pack adds specialist agents for:
- React-specific review
- accessibility and UX review
- frontend API contract modeling
- state ownership review
- component composition review

These specialists fall into two categories: required closeout gates and conditional specialists. Required closeout gates must always run before PR-ready closeout when frontend code changes. Conditional specialists should be dispatched deliberately when the change shape or risk triggers their review area rather than by default for every workflow. Minimal or small-step routing only describes how narrowly to slice downstream specialist work after intake; it does not relax mandatory fail-closed workflow intake, bootstrap artifacts, or required review gates when stack triggers are present.
Every specialist return must include the template `Return Contract` section and a recommended next agent.
Routing metadata values such as `next_agent_alias` and every `Use agent spec` line must use aliases from `agents-core/agent-docs/routing/agent-spec-alias-map.md`. Filenames below are file references only, not routing values.

Stack specialist routing aliases map to these files:

- `Frontend-Api-Contract-Modeling` -> `agents/api-contract-modeling.agent.md`
- `Frontend-Code-Reviewer` -> `agents/frontend-code-reviewer.agent.md`
- `Frontend-Accessibility-Ux-Reviewer` -> `agents/accessibility-ux-reviewer.agent.md`
- `Frontend-React-State-Ownership-Guardian` -> `agents/react-state-ownership-guardian.agent.md`
- `Frontend-React-Component-Composition-Reviewer` -> `agents/react-component-composition-reviewer.agent.md`

Frontend feature and bug default gates:
- `Frontend-Code-Reviewer` (`frontend-code-reviewer.agent.md`) is required before PR-ready closeout when frontend code changes
- `Frontend-Accessibility-Ux-Reviewer` (`accessibility-ux-reviewer.agent.md`) is required before PR-ready closeout when frontend code changes
- `Frontend-React-Component-Composition-Reviewer` (`react-component-composition-reviewer.agent.md`) is required before PR-ready closeout when frontend code changes
- `Frontend-Api-Contract-Modeling` (`api-contract-modeling.agent.md`) and `Frontend-React-State-Ownership-Guardian` (`react-state-ownership-guardian.agent.md`) are conditional pre-closeout gates dispatched when contract/mapping boundaries or owner/tier choice are unclear or changing
- `commit-authoring-operator` is required after required/triggered review gates pass with no blockers, and must push successful commit(s); this alone makes the workflow closeout-ready
- `pull-request-author-operator` runs only on an explicit, separate PR request; when requested, it must return a live PR URL/number
- closeout must be blocked/awaiting-approval when push fails; a failed explicitly-requested PR blocks only that request, never workflow closeout
- trivial feature fast-path is allowed only when scope is localized and clear, and must still enforce test-first/evidence/review gates
- trivial bug fast-path is allowed only when scope is localized and clear, and must still enforce test-first/evidence/review gates

## 8. Tool mapping responsibility

Concrete package and tooling mandates belong in repo-local overlays, not this stack pack.

Repo-local `AGENTS.md` overlays should map:

- `capability_owners.local_ui_state_owner` implementation expectations
- `capability_owners.shared_client_state_owner` to the chosen shared-state tool
- `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) for new/updated frontend slices using `shared_client_state_owner`
- `capability_owners.server_state_owner` to the chosen server-state tool
- `test_layer_matrix` execution (`unit`, `component`, `integration`, `e2e`) to chosen test tooling
