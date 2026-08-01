# Agent Handoff Workflow

## Purpose

This document defines the default multi-agent workflow for a hub-and-spoke development process.

The default hub is `workflow-orchestrator`.

## Core Rules

1. One workflow should have one active owner: `workflow-orchestrator`.
2. `workflow-orchestrator` dispatches work using a **Worker Prompt Package**.
3. Every **Worker Prompt Package** and **Template-Based Handoff** must begin with line 1: `Use agent spec: <Agent-Spec-Alias>`.
4. `<Agent-Spec-Alias>` must resolve via `agent-docs/routing/agent-spec-alias-map.md` (or equivalent core doc path in the active repo layout).
5. Every specialist return must be a **Template-Based Handoff** using `.github/agents/agents-core/agent-docs/templates/handoff-template.md` (or equivalent core template path in the active repo layout) with all required sections.
6. Worker execution must not begin until guard acknowledgement is present and valid.
7. Workflow Orchestrator must reissue handoff on missing or mismatched guard acknowledgement before accepting output.
8. Prefer the smallest competent next agent.
9. Preserve explicit approvals, assumptions, and deferrals in every step.
10. Keep work incremental and reversible.
11. Enforce test-first sequencing for implementation slices.
12. Require test evidence in every implementation handoff and checkpoint.
13. Keep stack-specific or repo-specific command triggers in overlays; core does not prescribe command text.
14. Persist every Worker Prompt Package and every Template-Based Handoff as Markdown artifacts on disk.
15. Maintain one Workflow Artifact Index per workflow at `.agent-workflows/<workflow_id>/index.md`.
16. Require file-based fresh-context bootstrap messaging using an absolute prompt artifact path.
17. When workflow status becomes `closed`, delete `.agent-workflows/<workflow_id>/` after final closeout is emitted.
18. After a specialist persists a handoff artifact, require a Workflow-Orchestrator-ready completion block with absolute handoff path and continue-workflow line.
19. After workflow-orchestrator persists a worker prompt artifact, require a workflow-orchestrator completion bootstrap block with target alias, absolute prompt path, and continue-workflow line.
20. Every Worker Prompt Package and every Template-Based Handoff must carry an Execution Profile Metadata block (`execution_profile`, `capability`, `reasoning_demand`, `risk`, `scope`, `reversibility`, `verification`, `orchestration_mode`, `rationale`) per `agent-docs/routing/execution-profile-schema.md` (or equivalent core doc path in the active repo layout).
21. Execution profile assignment is per-dispatch: successive dispatches within one workflow may use different profiles, and a specialist may escalate its own profile but must never silently downgrade a profile assigned by the dispatching orchestrator or a prior escalation.

## Workflow Artifact Index v1 (Required)

Use this runtime storage layout for every workflow:

- `.agent-workflows/<workflow_id>/index.md`
- `.agent-workflows/<workflow_id>/prompts/*.prompt.md`
- `.agent-workflows/<workflow_id>/handoffs/*.handoff.md`
- `.agent-workflows/<workflow_id>/checkpoints/*.checkpoint.md`

Notes:
- `.agent-workflows/` is runtime workflow state and should not be manually edited.
- Use Markdown as the source of truth; no JSON manifest is required.

### Artifact Naming Contract

Every persisted prompt, handoff, and checkpoint receives one workflow-wide Artifact ID.

- Artifact IDs use the format `artifact-NNN`, with a zero-padded numeric sequence beginning at `artifact-001`.
- Before writing an artifact, allocate the next available Artifact ID from the workflow index. The sequence is shared across `prompts/`, `handoffs/`, and `checkpoints/`.
- Artifact IDs are immutable and must not be reused or renumbered within a workflow.
- File names use `<artifact-id>-<descriptive-slug>.<artifact-type>.md`.
- Valid artifact-type suffixes are `prompt`, `handoff`, and `checkpoint`.
- Prompt slugs describe the assigned work or target; handoff slugs describe source-to-recipient routing; checkpoint slugs describe the workflow state captured.
- `index.md` records artifact relationships and chronological order. Related files do not share an Artifact ID.

Examples:

- `prompts/artifact-001-feature-plan.prompt.md`
- `handoffs/artifact-002-feature-plan-to-test-strategy.handoff.md`
- `checkpoints/artifact-003-after-test-strategy.checkpoint.md`

Required `index.md` sections:

1. `Workflow Metadata` (workflow id, active owner, current artifact id, updated timestamp)
2. `Latest Worker Prompt by Target Agent`
3. `Latest Specialist Return by Source Agent`
4. `Artifact Log (Chronological)` with newest entry first

Use `agent-docs/templates/workflow-artifact-index-template.md` as the default index scaffold.

Each artifact log entry must include:
- timestamp
- artifact id
- artifact type (`worker-prompt` | `specialist-handoff` | `checkpoint`)
- from agent
- to agent
- artifact id
- absolute artifact path
- status note

## Artifact Cleanup On Closeout (Required)

To prevent unbounded artifact growth:

1. Close the workflow only after all normal completion gates pass.
2. Emit final user-facing closeout summary in the active session.
3. Delete `.agent-workflows/<workflow_id>/` (prompts, handoffs, checkpoints, and index).
4. Report `Artifact Cleanup Status: completed` or `Artifact Cleanup Status: failed (<reason>)`.
5. If cleanup fails, treat closeout as incomplete and rerun cleanup before final closure.

## Default Sequence

A common feature workflow is:

1. `workflow-orchestrator`
2. `feature-plan-delivery-orchestrator`
3. `architecture-planner` as needed
4. `test-strategy-engineer`
5. `implementation-engineer` (pre-implementation failing tests first, then code changes)
6. `workflow-orchestrator` dispatches required stack/repo review specialists for post-implementation gate checks
7. if reviewers return blocking findings, `workflow-orchestrator` routes scoped rework back to `implementation-engineer` and re-runs required reviews
8. `workflow-orchestrator` consolidates and routes next-step work
9. repeat until complete

A dependency decision may insert:
- `dependency-governance`

## Bug Workflow

Typical bug flow:

1. `workflow-orchestrator` normalizes the report
2. `feature-plan-delivery-orchestrator` or `architecture-planner` scopes the fix if needed
3. `test-strategy-engineer` defines regression protection and `test_layer_matrix` requirements
4. `implementation-engineer` produces failing `required_preimplementation_tests`, then applies the fix
5. `workflow-orchestrator` dispatches required stack/repo review specialists and routes rework if required
6. `workflow-orchestrator` consolidates and closes or routes follow-up work

## Workflow-Orchestrator Dispatch Loop

For each dispatch cycle:

1. Workflow Orchestrator selects the next worker based on workflow state.
2. Workflow Orchestrator emits a Worker Prompt Package using the handoff template sections:
   - line 1: `Use agent spec: <Agent-Spec-Alias>` from the core alias map
   - Header
   - Workflow Context
   - Artifact Metadata (Required)
   - Guard Pattern (Required)
   - Trigger
   - Pass
   - Expect
   - Return Contract
   - Worker Acknowledgement (Required)
   - Completion Signal
3. Workflow Orchestrator allocates the next Artifact ID and writes the Worker Prompt Package to `.agent-workflows/<workflow_id>/prompts/artifact-NNN-<descriptive-slug>.prompt.md`.
4. Workflow Orchestrator updates `.agent-workflows/<workflow_id>/index.md`:
   - set or refresh `Latest Worker Prompt by Target Agent`
   - append `Artifact Log (Chronological)` entry
5. Workflow Orchestrator provides both bootstrap outputs with the absolute prompt path:
   - `Read and execute worker prompt at: <absolute_path_to_.prompt.md>.`
   - `Use agent spec: <target_specialist_alias>`
   - `Active Agent: Workflow-Orchestrator`
   - `Execution Profile: <execution_profile>`
   - `Reasoning Demand: <reasoning_demand> (<reason>)`
   - `Workflow-Orchestrator worker prompt has been created for specialist at:`
   - `<absolute_prompt_path>`
   - `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`
6. Worker prints acknowledgement lines before execution:
   - `Active Agent: <target>.agent.md`
   - `Execution Profile: <execution_profile>`
   - `Reasoning Demand: <reasoning_demand> (<one-line reason>)`
7. Workflow Orchestrator validates acknowledgement before accepting execution output.
8. If acknowledgement is missing or mismatched, Workflow Orchestrator reissues corrected handoff and does not advance state.
9. Workflow Orchestrator enforces test-first gate state before dispatching implementation.
10. Workflow Orchestrator allocates the next Artifact ID and writes the worker return to `.agent-workflows/<workflow_id>/handoffs/artifact-NNN-<descriptive-slug>.handoff.md` before further routing.
11. Workflow Orchestrator updates `.agent-workflows/<workflow_id>/index.md`:
    - set or refresh `Latest Specialist Return by Source Agent`
    - append `Artifact Log (Chronological)` entry
12. Workflow Orchestrator ingests worker output, updates workflow state, and routes next step, including required review-gate loops.
13. Workflow Orchestrator rejects free-form worker summaries that do not include a template-complete `Return Contract`.
14. When workflow status remains `in-progress`, Workflow Orchestrator emits the next Worker Prompt Package in the same cycle without waiting for a manual "next prompt" request.

## Handoff Requirements

Every handoff must include:
- line 1: `Use agent spec: <Agent-Spec-Alias>` from the core alias map
- `Artifact Metadata` block with artifact id and paths
- Execution Profile Metadata block (`execution_profile`, `capability`, `reasoning_demand`, `risk`, `scope`, `reversibility`, `verification`, `orchestration_mode`, `rationale`, and `escalated_from`/`escalation_reason` when escalated) per `agent-docs/routing/execution-profile-schema.md`
- current objective
- scope boundaries
- decisions made
- validation status
- open risks
- recommended next agent
- `capability_owners` with stack-defined required keys
- for frontend slices that set `capability_owners.shared_client_state_owner`, `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) for new/updated slices
- `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) with `required`/`N/A` rationale
- `required_preimplementation_tests` for required layers
- `preimplementation_failing_test_evidence` for required pre-implementation layers
- `e2e_status` (`planned`, `authored`, `passing`, or `N/A` with rationale)
- explicit `Expect` section (required output from receiving agent)
- explicit `Return Contract` section
- explicit `Completion Signal`
- `Return To Agent: workflow-orchestrator.agent.md` by default unless intentionally overridden in the incoming handoff

Path-form `Use agent spec` lines are non-compliant and must be reissued with aliases.

## Test-First and Evidence Gates

Implementation is not ready to start until all are true:
- `capability_owners` is explicit with stack-defined required keys
- for frontend slices using `capability_owners.shared_client_state_owner`, `capability_owners.shared_client_state_tier` is explicit (`subtree` | `cross_feature`)
- `test_layer_matrix` exists for `unit`, `component`, `integration`, `e2e`
- each test layer is marked `required` or `N/A` with rationale
- `required_preimplementation_tests` are defined
- `preimplementation_failing_test_evidence` is recorded for required pre-implementation layers

Track gate state as:
- `Pending - test strategy handoff required`
- `Ready - test-first payload accepted`
- `Blocked - test-first evidence missing or incomplete`
- `Passed - implementation validated against test-first payload`

## Approval Boundaries

Pause and escalate when work requires:
- new dependencies
- new top-level architecture or broad refactors
- new environment/runtime assumptions
- material scope expansion
- contract changes that affect other consumers

## Checkpointing

Create a checkpoint when:
- a meaningful slice completes
- approval is needed
- a blocker prevents continuation
- context needs to be resumed later

Use `agent-docs/templates/checkpoint-template.md`.
Allocate the next Artifact ID before storing each checkpoint at `.agent-workflows/<workflow_id>/checkpoints/artifact-NNN-<descriptive-slug>.checkpoint.md`, then log it in `index.md`.

## Resume Procedure

When resuming from a fresh Workflow Orchestrator context:
1. Load `.agent-workflows/<workflow_id>/index.md` and resolve latest artifacts.
2. Load latest checkpoint for the active workflow from `.agent-workflows/<workflow_id>/checkpoints/`.
3. Reconstruct request summary, decisions, test evidence, open risks, and pending step.
4. Resolve the next target agent via workflow state and use `Latest Worker Prompt by Target Agent` when resuming an existing dispatch.
5. Emit or refresh the next Worker Prompt Package with the handoff template.
6. Continue the dispatch loop.

## Fresh Context Protocol (File-Based)

Use this exact message format in the fresh worker window:

- `Read and execute worker prompt at: <absolute_path_to_.prompt.md>.`
- `Acknowledge with: Active Agent: <target>.agent.md, Execution Profile: <execution_profile>, and Reasoning Demand: <reasoning_demand> (<reason>).`

File selection rule:
1. Open `.agent-workflows/<workflow_id>/index.md`.
2. Find the row under `Latest Worker Prompt by Target Agent` for the intended worker.
3. Copy only that absolute path into the fresh-context bootstrap line.

## Workflow-Orchestrator Completion Bootstrap (Required)

After workflow-orchestrator persists `.agent-workflows/<workflow_id>/prompts/*.prompt.md`, output this exact copy/paste-ready block:

- `Use agent spec: <target_specialist_alias>`
- `Active Agent: Workflow-Orchestrator`
- `Execution Profile: <execution_profile>`
- `Reasoning Demand: <reasoning_demand> (<reason>)`
- `Workflow-Orchestrator worker prompt has been created for specialist at:`
- `<absolute_prompt_path>`
- `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Validation requirements:
1. `<target_specialist_alias>` must match the dispatch target alias from the core alias map.
2. `<absolute_prompt_path>` must exist on disk and match the persisted worker prompt artifact.
3. `<workflow_id>` must match the active workflow id in `.agent-workflows/<workflow_id>/index.md`.

## Specialist Completion Bootstrap (Required)

After a non-`workflow-orchestrator` specialist persists `.agent-workflows/<workflow_id>/handoffs/*.handoff.md`, output this exact copy/paste-ready block:

- `Use agent spec: Workflow-Orchestrator`
- `Active Agent: <source_specialist_alias>`
- `Execution Profile: <execution_profile>`
- `Reasoning Demand: <reasoning_demand> (<reason>)`
- `Template-based specialist handoff has been created for Workflow-Orchestrator at:`
- `<absolute_handoff_path>`
- `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Validation requirements:
1. `<source_specialist_alias>` must match the executing specialist alias from the core alias map.
2. `<absolute_handoff_path>` must exist on disk and match the persisted specialist handoff artifact.
3. `<workflow_id>` must match the active workflow id in `.agent-workflows/<workflow_id>/index.md`.

## Legacy Reasoning Mode Compatibility (Deprecated)

Some pre-update workflow artifacts persisted under `.agent-workflows/<workflow_id>/` may still carry the legacy `Reasoning Mode: Fast|High (<reason>)` contract. Treat this as deprecated compatibility input only:

1. Do not validate new dispatches or handoffs against the legacy `Reasoning Mode` contract; it is not a substitute for the Execution Profile Metadata block.
2. When resuming a workflow whose latest persisted artifact still uses `Reasoning Mode: Fast|High`, `workflow-orchestrator` must reissue the next Worker Prompt Package using the current Execution Profile Metadata contract before continuing the dispatch loop.
3. Never infer an `execution_profile` or `reasoning_demand` value from legacy `Fast`/`High` text; select a value using `agent-docs/routing/reasoning-selection-policy.md`.

## Closeout

A workflow is ready to close when:
- requested scope is complete or explicitly deferred
- validation status is known
- required `required_preimplementation_tests` are passing
- required `e2e_status` is `passing`
- required stack/repo review gates are complete with no blocking findings
- unresolved risks are recorded
- the final summary is understandable without replaying the whole thread
- `.agent-workflows/<workflow_id>/` artifact cleanup has completed successfully
