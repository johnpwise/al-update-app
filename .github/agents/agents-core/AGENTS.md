# Agents Core Pack - AGENTS.md

This document defines reusable core workflow guidance that can be inherited by stack packs and repo overlays.

Stack packs should add stack-specific policy and specialists. Repo-local `AGENTS.md` files should add project facts, exceptions, and approval boundaries.

## 1. Scope

This core pack targets stack-neutral workflow coordination for:

- feature delivery
- bug triage and fixes
- refactor planning and execution
- review and validation routing
- handoff-safe, resumable multi-agent collaboration

This pack is appropriate when:
- one request may require multiple specialist agents
- continuity and workflow state need an explicit owner
- approvals, assumptions, and deferrals must stay visible across steps

## 2. Defaults

Unless a stack or repo overlay says otherwise, agents should assume:

- `workflow-orchestrator` is the active workflow owner
- non-trivial feature requests should route to `feature-plan-delivery-orchestrator` before execution specialists
- stack overlays may define feature-intake command triggers; when present, `workflow-orchestrator` should enforce them before feature dispatch
- when a stack overlay defines explicit intake triggers, triggered requests should run in fail-closed mode until required workflow artifacts are persisted by the workflow owner
- in fail-closed mode, no implementation edits are allowed before required workflow artifacts exist
- in fail-closed mode, the first response should report workflow ownership and routing state, not direct implementation
- in fail-closed mode, if trigger format or required routing metadata is incomplete, request a correctly formatted reissue before code changes
- bug requests should be routed to `feature-plan-delivery-orchestrator` for `trivial`/`non-trivial` classification before execution routing
- non-trivial bug requests should route to `feature-plan-delivery-orchestrator` before execution specialists
- trivial bug fast-path routing is allowed only when boundaries are clear and must still enforce test-first/evidence/review gates
- every non-`workflow-orchestrator` specialist MUST return a **Template-Based Handoff** using `agent-docs/templates/handoff-template.md` (or the equivalent core template path in the active repo layout)
- default handoff routing returns to `workflow-orchestrator.agent.md` unless the incoming handoff explicitly overrides `Return To Agent`
- after persisting a specialist handoff artifact, the specialist MUST emit a copy/paste-ready completion block with absolute handoff path and continue-workflow line (targeting next specialist for `in-progress` chaining, or `Workflow-Orchestrator` for reentry states)
- worker routing metadata (`next_agent_alias`, `workflow_status`, `reentry_reason`) controls happy-path chaining; `workflow-orchestrator` enforces required gate order on reentry
- `commit-authoring-operator` invokes the portable `commit-and-push` skill rather than duplicating its procedure; success requires commit SHA evidence plus successful `git push` evidence (command, remote, and branch/ref)
- a workflow reaches `ready-for-closeout` once `commit-authoring-operator` succeeds; PR creation is a separate, explicitly requested step and is never a closeout precondition
- `pull-request-author-operator` runs only when the user makes an explicit, separate PR request recognised per the shared trigger-recognition standard; it is never dispatched automatically after commit-and-push
- when explicitly requested, `pull-request-author-operator` success requires a live PR URL and PR number; artifact-only PR output is not success
- if push fails, routing must return `blocked` or `awaiting-approval`; `ready-for-closeout` is not allowed
- if an explicitly requested PR creation fails, routing must return `blocked` or `awaiting-approval` for that request without reopening an already closeout-ready workflow
- each step should use the smallest competent next specialist
- smallest-step routing applies only after required workflow intake/bootstrap gates are satisfied; it never overrides fail-closed trigger handling or lets implementation start before workflow artifacts exist
- work should be sliced for small, reviewable, reversible diffs
- assumptions, approvals, and deferrals must be explicit
- no hidden scope expansion
- no new dependencies without dependency review and approval
- ownership and validation policy should be expressed in capability terms, not package names
- capability fields are mandatory for implementation slices: `capability_owners`, `test_layer_matrix`
- test-first sequencing is mandatory for implementation slices
- each slice must define `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) with `required` or `N/A` plus rationale
- `required_preimplementation_tests` (`unit`/`component` and relevant `integration`) must exist and fail before production code changes
- `e2e_status` must be tracked as `planned` -> `authored` -> `passing`; required `e2e_status` must be `passing` before closeout
- handoffs and checkpoints must record `test_layer_matrix`, `required_preimplementation_tests`, `preimplementation_failing_test_evidence`, and `e2e_status`
- implementation handoffs must include runtime/compatibility audit coverage and explicit compatibility impact notes when applicable
- stack packs should define required `capability_owners` keys for their domain
- frontend stacks using `capability_owners.shared_client_state_owner` should require `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) for new/updated frontend slices
- repo-local overlays should map stack-defined capabilities and test layers to concrete packages and tooling for that repository
- required stack/repo review gates should be routed by `workflow-orchestrator`; blocking review findings should trigger scoped rework loops
- every dispatch and handoff must carry Execution Profile Metadata (`execution_profile`, `capability`, `reasoning_demand`, `risk`, `scope`, `reversibility`, `verification`, `orchestration_mode`, `rationale`) per `agent-docs/routing/execution-profile-schema.md`; profiles are selected per-dispatch and may vary across a workflow
- a specialist may escalate its own dispatch's execution profile with recorded `escalated_from`/`escalation_reason`, but must never silently downgrade an assigned or escalated profile without explicit recorded rationale and re-acknowledgement
- the legacy `Reasoning Mode: Fast|High` contract is deprecated compatibility input only; do not validate against it, and reissue any pre-update artifact still using it with a valid Execution Profile Metadata block before continuing

### Explicit trigger-recognition standard

Every action gated behind an "explicit request" (PR authoring today; release/hotfix lifecycle actions where a repo or stack overlay adds them) uses one shared recognition rule instead of a per-specialist judgment call:

- A trigger fires only on a clear, present-tense, imperative instruction that names the specific action (for example "create develop PR", "open a PR").
- Hedged, past-tense, conditional, or exploratory phrasing (for example "I think we should open a PR soon", "we'll need a PR eventually") must not fire the action.
- If a message is ambiguous, ask the user to confirm the exact action rather than guessing or silently proceeding.
- This rule is authoritative across `agents-core` and all stack/repo overlays; overlays must not define a different or looser recognition standard for the same class of action.

## 3. Tool-Agnostic state and validation capability model

Use these capability rules in all implementation planning and handoffs:

- `capability_owners`: a stack-defined map of ownership boundaries for behavior in scope
- `capability_owners` keys should be explicit in every implementation slice
- frontend state tiering policy is defined in `agent-docs/standards/architecture/frontend-state-ownership-standards.md`
- `test_layer_matrix`: explicitly classify `unit`, `component`, `integration`, and `e2e` as `required` or `N/A` with rationale

Do not:

- encode policy decisions in terms of specific libraries at the core layer
- treat implementation-ready slices as complete without explicit `capability_owners` and test evidence

## 4. Intake/Reentry workflow model

Prefer this default flow:

1. `workflow-orchestrator` normalizes intake and routes next step
2. `feature-plan-delivery-orchestrator` creates incremental slices with `capability_owners` and `test_layer_matrix` expectations
3. downstream specialists chain directly via handoff routing metadata while status is `in-progress` and reentry is `none`
4. `architecture-planner` is used when boundaries or contracts are affected
5. `test-strategy-engineer` defines `test_layer_matrix` and validates testing against `capability_owners`
6. `implementation-engineer` writes `required_preimplementation_tests`, captures failing evidence, executes approved slices, tracks `e2e_status`, and performs required runtime/compatibility audit coverage before handoff
7. required stack/repo review specialists execute; blocking findings route scoped rework to `implementation-engineer`
8. `workflow-orchestrator` re-enters for blockers/approvals/closeout and consolidates state/checkpoints
9. repeat until complete or blocked

Do not:
- run multiple active workflow owners in parallel
- collapse planning, architecture, implementation, and validation into one large step unless the task is trivial
- hand off without explicit scope and validation status

## 5. Routing guidance across core specialists

Use:

- `feature-plan-delivery-orchestrator` for scope slicing and delivery sequencing
- `architecture-planner` for ownership, layering, and contract-sensitive decisions
- `test-strategy-engineer` for required `test_layer_matrix` decisions and pre-implementation failing-test design
- `implementation-engineer` for test-first execution after required failing-test evidence exists
- `dependency-governance` for package/tooling/runtime dependency decisions
- `commit-authoring-operator` for post-review commit planning, commit message authoring, commit execution, and push execution evidence (via the `commit-and-push` skill)
- `pull-request-author-operator` for live PR creation (via the `create-develop-pr` skill or the equivalent repo/stack-defined PR skill), PR title/body authoring, and PR URL/number evidence, dispatched only on an explicit, separate PR request (never automatically after commit-and-push)
- stack/repo review specialists for post-implementation quality gates and closeout readiness

Return to `workflow-orchestrator` when handoff routing metadata indicates `blocked`, `awaiting-approval`, or `ready-for-closeout`.

## 6. Handoff and checkpoint expectations

Every handoff must be a **Template-Based Handoff** and include:

- current objective
- in-scope and deferred scope
- decisions and assumptions
- validation status and known gaps
- risks/open questions
- recommended next agent
- Execution Profile Metadata (`execution_profile`, `capability`, `reasoning_demand`, `risk`, `scope`, `reversibility`, `verification`, `orchestration_mode`, `rationale`, and `escalated_from`/`escalation_reason` when escalated) per `agent-docs/routing/execution-profile-schema.md`
- `Return Contract` with explicit `Return To Agent` (default: `workflow-orchestrator.agent.md`)

Terminology standard:

- dispatch from `workflow-orchestrator`: **Worker Prompt Package**
- return from specialist agents: **Template-Based Handoff**

Specialist completion bootstrap output (required):

- for `workflow_status: in-progress` and `reentry_reason: none`:
  - `Use agent spec: <next_agent_alias>`
  - `Active Agent: <source_specialist_alias>`
  - `Execution Profile: <execution_profile>`
  - `Reasoning Demand: <reasoning_demand> (<reason>)`
  - `Template-based specialist handoff has been created at:`
  - `<absolute_handoff_path>`
  - `Continue workflow <workflow_id> and auto-run next specialist.`
- for reentry states (`blocked`, `awaiting-approval`, `ready-for-closeout`):
  - `Use agent spec: Workflow-Orchestrator`
  - `Active Agent: <source_specialist_alias>`
  - `Execution Profile: <execution_profile>`
  - `Reasoning Demand: <reasoning_demand> (<reason>)`
  - `Template-based specialist handoff has been created for Workflow-Orchestrator at:`
  - `<absolute_handoff_path>`
  - `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Workflow-Orchestrator completion bootstrap output (required):

- `Use agent spec: <target_specialist_alias>`
- `Active Agent: Workflow-Orchestrator`
- `Execution Profile: <execution_profile>`
- `Reasoning Demand: <reasoning_demand> (<reason>)`
- `Workflow-Orchestrator worker prompt has been created for specialist at:`
- `<absolute_prompt_path>`
- `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Create checkpoints when:

- a meaningful slice completes
- approval is required
- a blocker prevents continuation
- work must pause and resume later

Use these shared docs:
- `agent-docs/workflows/handoff-workflow.md`
- `agent-docs/workflows/feature-workflow-routing.md`
- `agent-docs/workflows/bug-workflow-routing.md`
- `agent-docs/standards/architecture/frontend-state-ownership-standards.md`
- `agent-docs/templates/handoff-template.md`
- `agent-docs/templates/checkpoint-template.md`
- `agent-docs/templates/feature-request-template.md`
- `agent-docs/templates/bug-report-template.md`
- `agent-docs/routing/execution-profile-schema.md`
- `agent-docs/routing/execution-profile-policy.md`
- `agent-docs/routing/reasoning-selection-policy.md`
- `agent-docs/routing/core-agent-execution-profile-defaults.md`
- `agent-docs/routing/execution-profile-worked-examples.md`

## 7. Approval boundaries

Pause and escalate when work requires:

- new dependencies or dependency upgrades with broad impact
- new top-level architecture or broad refactors
- new runtime or environment assumptions
- material scope expansion
- external contract changes affecting other consumers
- bypassing required pre-implementation failing tests

## 8. Test-First enforcement

Regression contract rule:

- existing tests are regression protections and must be preserved by default
- do not modify, weaken, or delete an existing test just to accommodate a new implementation
- when new behavior is added, prefer adding new tests before altering existing ones
- change an existing test only when the asserted behavior is intentionally changing, the test is demonstrably incorrect, or the test is overly implementation-coupled and must be rewritten to express the intended contract
- any change to an existing test should be explicit in the handoff/checkpoint, including why the prior test no longer represented the correct contract


Implementation work is not ready to start until all are true:

- `test_layer_matrix` exists for `unit`, `component`, `integration`, and `e2e`
- `capability_owners` exists with stack-required keys
- each layer is marked `required` or `N/A` with rationale
- `required_preimplementation_tests` are identified
- `preimplementation_failing_test_evidence` is recorded

Closeout is not ready until all are true:

- required `required_preimplementation_tests` are passing
- required `e2e_status` is `passing`
- required stack/repo review gates are passing with no blocking findings
- commit authoring evidence includes commit SHA(s) plus successful push command evidence (remote + branch/ref)
- compatibility impacts and breaking-change/migration handling are explicit in handoff/checkpoint artifacts when relevant
- any `N/A` decisions remain explicit and justified

PR creation is not a closeout precondition. `pull-request-author-operator` runs only on an explicit, separate PR request and is reported independently of workflow closeout. If a PR was explicitly requested during the workflow, its evidence (live PR URL plus PR number) should also be recorded, but closeout itself never waits on it.

## 9. Layering and override model

`agents-core` provides stack-neutral workflow and governance baseline.

- stack-specific policy belongs in stack packs
- repo-specific facts and exceptions belong in repo-local overlays
- overlays may tighten or override defaults with explicit rationale
- overlays should define concrete package/tool mappings for stack-defined `capability_owners` and `test_layer_matrix`
- avoid duplicating stack rules in core unless they are clearly cross-stack
