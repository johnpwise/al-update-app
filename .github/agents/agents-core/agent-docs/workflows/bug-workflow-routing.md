# bug-workflow-routing.md

## Purpose

This document defines the default end-to-end workflow for bug triage and fixes when using `agents-core`.

## Ownership model

- `workflow-orchestrator` is the workflow intake, reentry, and closeout owner.
- Specialists can chain directly while handoff routing metadata is `workflow_status: in-progress` with `reentry_reason: none`.
- `workflow-orchestrator` re-enters when specialist handoff routing metadata is `blocked`, `awaiting-approval`, or `ready-for-closeout`.
- Worker `recommended next agent` remains advisory; explicit routing metadata controls chain progression.

## Artifact persistence and fresh-context routing

- `workflow-orchestrator` persists initial dispatches to `.agent-workflows/<workflow_id>/prompts/*.prompt.md`.
- Specialists persist returns to `.agent-workflows/<workflow_id>/handoffs/*.handoff.md`.
- The active executor updates `.agent-workflows/<workflow_id>/index.md` on every prompt/handoff write.
- After a specialist handoff with `workflow_status: in-progress` and `reentry_reason: none`, auto-run the next specialist from `next_agent_alias` without waiting for user action.
- When specialist handoff metadata requests reentry (`blocked`, `awaiting-approval`, `ready-for-closeout`), emit Workflow-Orchestrator bootstrap output and return control to `workflow-orchestrator`.
- Workflow-Orchestrator dispatch output remains required when `workflow-orchestrator` creates worker prompts.
- For fresh worker windows, use the exact bootstrap line:
   - `Read and execute worker prompt at: <absolute_path_to_.prompt.md>.`
- Resolve that path from `Latest Worker Prompt by Target Agent` in `.agent-workflows/<workflow_id>/index.md`.
- When workflow closeout is complete, delete `.agent-workflows/<workflow_id>/`.

## Bug intake and classification

- Bug intake requires a leading `Bug Fix` trigger.
- If the trigger is missing, `workflow-orchestrator` must request a correctly triggered reissue before bug workflow dispatch.
- `workflow-orchestrator` validates trigger format and normalizes the report using `.github/agents/agents-core/agent-docs/templates/bug-report-template.md`.
- Even when the eventual fix slice is minimal or fast-path eligible, triggered intake remains fail-closed until workflow bootstrap artifacts exist; small-step routing applies only after that intake gate is complete.
- `feature-plan-delivery-orchestrator` classifies bug complexity as `trivial` or `non-trivial` with rationale.
- `feature-plan-delivery-orchestrator` emits downstream chain routing metadata (`next_agent_alias`, `workflow_status`, `reentry_reason`).

### Trivial bug fast-path eligibility

Fast-path is allowed only when all are true:

- behavior and acceptance criteria are explicit
- repro scope is localized to a small area
- no approval-boundary work is expected
- no cross-feature boundary or contract changes are expected

If any condition fails, route to the full bug path.

## Full bug path (default)

1. User request with `Bug Fix` trigger -> `workflow-orchestrator` intake and normalization
2. `workflow-orchestrator` -> `feature-plan-delivery-orchestrator`
3. `feature-plan-delivery-orchestrator` -> specialist handoff with complexity classification and `next_agent_alias`
4. If `workflow_status: in-progress` + `reentry_reason: none`, specialist chain continues directly through needed pre-implementation specialists, `test-strategy-engineer`, and `implementation-engineer`
5. Required stack/repo review gates run before closeout
6. If any required or triggered reviewer is blocking (for example `changes-required`), route scoped rework to `implementation-engineer`, then rerun required/triggered reviewers
7. On reviewer-gate success, route to `commit-authoring-operator` for commit planning/message authoring, commit execution (via the `commit-and-push` skill), and push
8. `commit-authoring-operator` returns to `workflow-orchestrator` with `workflow_status: ready-for-closeout` and `reentry_reason: closeout` once push succeeds
9. `workflow-orchestrator` re-enters for blocker/approval/closeout events and closes only when all required gates pass
10. `pull-request-author-operator` runs only on a separate, explicit PR request from the user (before or after closeout); it is never dispatched automatically as part of this chain and is never a closeout precondition

## Trivial fast path (strict gates still apply)

When fast-path eligibility is met, `workflow-orchestrator` may use:

1. User request with `Bug Fix` trigger -> `workflow-orchestrator` intake and trivial classification
2. `workflow-orchestrator` -> `feature-plan-delivery-orchestrator` for explicit trivial classification (or proceed only when existing workflow state already has explicit trivial classification)
3. `feature-plan-delivery-orchestrator` -> specialist handoff with chain routing metadata
4. `test-strategy-engineer` runs before `implementation-engineer`; routing may chain directly while `workflow_status: in-progress` + `reentry_reason: none`
5. Required stack/repo review specialists run before closeout
6. Blocking findings -> scoped rework loop to `implementation-engineer` -> rerun required/triggered reviewers
7. On reviewer-gate success, route to `commit-authoring-operator`, which pushes and returns to `workflow-orchestrator` for final closeout reentry
8. `workflow-orchestrator` re-enters for blocker/approval/closeout events and closes only when all required gates pass
9. `pull-request-author-operator` runs only on a separate, explicit PR request from the user; it is never dispatched automatically as part of this chain and is never a closeout precondition

## Mandatory evidence and review gates

- Implementation must not start before required `test_layer_matrix` exists (`unit`, `component`, `integration`, `e2e`) with `required` or `N/A` rationale.
- Implementation must not start before required `required_preimplementation_tests` are identified.
- Implementation must not start before required `preimplementation_failing_test_evidence` is recorded.
- Planner classification (`trivial` or `non-trivial`) must be explicit before execution routing.
- Fast-path must not bypass test-first/evidence/review gates.
- `capability_owners` with stack-defined required keys must be explicit for implementation slices.
- for frontend slices that set `capability_owners.shared_client_state_owner`, `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) must also be explicit.
- Required `e2e_status` must be `passing` before closeout.
- Required stack/repo reviewer gates must be explicitly classified as `always-required` or `conditional-by-risk/scope`.
- All `always-required` and all triggered `conditional-by-risk/scope` reviewer gates must be complete with no blocking findings before closeout.
- Commit authoring must run only after required reviewer gates pass with no blocking findings.
- Commit-and-push success (commit SHA(s) plus push evidence) is sufficient for `ready-for-closeout`; PR authoring is never required for closeout.
- PR authoring must run only on an explicit, separate PR request, and only after commit authoring is complete and commit SHAs are recorded; it must never be dispatched automatically after commit-and-push.

## Checkpoint and resume behavior

- Create a checkpoint when a slice completes, approval is needed, a blocker is hit, or context continuity risk increases.
- Resume by loading the latest checkpoint, reconstructing state/evidence/risks, and emitting the next Worker Prompt Package from `workflow-orchestrator`.
