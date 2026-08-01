# react-feature-intake.prompt.md

Use this when the core prompt/orchestration agent needs a React-aware intake pass before dispatching work.

## Intake policy

- Feature intake requires the request to start with `New Feature`.
- If the trigger is missing, do not dispatch a feature workflow; request a correctly triggered reissue first.
- After trigger validation, normalize the request and dispatch `feature-plan-delivery-orchestrator` for complexity classification and chain sequencing.
- Under workflow triggers, use fail-closed behavior: no implementation edits before workflow artifacts are bootstrapped.
- Worker prompt execution must use an `index-resolved` path from `.agent-workflows/<workflow_id>/index.md` (`Latest Worker Prompt by Target Agent`) that exists on disk.
- If the referenced prompt artifact is missing, not index-backed, or manually supplied without index support, hard-stop and require workflow-orchestrator to regenerate/save a valid worker prompt artifact before continuing.
- For new/updated frontend slices, when `capability_owners.shared_client_state_owner` is present, require `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`).

## Reusable trigger template

Use this exact starter to force workflow-orchestrator workflow routing:

```text
Run this as true multi-agent workflow execution.
You must delegate to specialists from .github/agents/** as separate worker runs.
Do not collapse specialist steps into one response.

For each step, persist artifacts in .agent-workflows/<workflow_id>/ and return:

Saved Artifact path
Workflow Index path
Fresh Context Bootstrap line
Workflow-Orchestrator or Specialist Completion Bootstrap block
Do not implement until required planner/test-strategy gates are completed.

Use agent spec: Workflow-Orchestrator
New Feature
<feature summary>
```

## Capture
- user-visible behavior requested
- affected screens, routes, or feature areas
- expected loading, error, empty, disabled, and success states
- `capability_owners.local_ui_state_owner` candidate
- `capability_owners.shared_client_state_owner` candidate
- `capability_owners.shared_client_state_tier` candidate (`subtree` | `cross_feature`) when shared client ownership is in scope
- `capability_owners.server_state_owner` candidate
- remote data involved
- forms, keyboard flow, or accessibility-sensitive interactions
- whether the change appears local, subtree-wide, or cross-page
- `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) with `required`/`N/A` rationale
- `required_preimplementation_tests` for `unit`/`component` and relevant `integration`
- `preimplementation_failing_test_evidence` expectations
- `e2e_status` plan (`planned` before implementation, `passing` before closeout when required)
- overlay tool-mapping impact (does repo overlay need updates for capability->tool mapping?)
- complexity signals for planner classification (`trivial` or `non-trivial`)

## Early routing hints
Route to:
- `feature-plan-delivery-orchestrator` first for all feature requests (planner performs complexity classification and chain routing)
- `test-strategy-engineer` when `test_layer_matrix` or pre-implementation test expectations are unclear
- `react-state-ownership-guardian.agent.md` when state location is unclear
- `Frontend-Api-Contract-Modeling` (`api-contract-modeling.agent.md`) when transport shapes or nullability are unclear
- `Frontend-Code-Reviewer`, `Frontend-Accessibility-Ux-Reviewer`, and `Frontend-React-Component-Composition-Reviewer` as required gates before PR-ready closeout when frontend code changes
- `implementation-engineer` for scoped rework when required reviewers return blocking findings

## Intake output shape
Return:
- feature summary
- scope
- assumptions
- complexity signals and constraints for planner classification
- `capability_owners.local_ui_state_owner`
- `capability_owners.shared_client_state_owner`
- `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) when `shared_client_state_owner` is present
- `capability_owners.server_state_owner`
- likely contract surface
- `test_layer_matrix` (`required`/`N/A` + rationale)
- `required_preimplementation_tests`
- `preimplementation_failing_test_evidence` expectations
- `e2e_status` plan and closeout expectation
- required review gates and rework-loop expectations
- recommended next agent
