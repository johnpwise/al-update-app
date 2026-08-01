# Workflow Checkpoint Template

Use this template to snapshot workflow state for safe pause, resume, or handoff.

## Checkpoint Metadata

- **Workflow ID:**
- **Artifact ID:**
- **Date:**
- **Created By:**
- **Status:** (`in-progress` | `blocked` | `awaiting-approval` | `ready-to-resume` | `closed`)

## Current Position

- Current artifact:
- Current objective:
- Recommended next agent:

## What Has Been Completed

- Completed work:
- Decisions made:
- Files or areas touched:

## What Remains

- Next actions:
- Deferred work:
- Approval needed:

## Validation State

- `capability_owners` (stack-defined required keys):
- for frontend slices using `capability_owners.shared_client_state_owner`, include `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) for new/updated slices:
- `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) with `required` or `N/A` plus rationale:
- `required_preimplementation_tests`:
- `preimplementation_failing_test_evidence` (`unit`/`component` and relevant `integration`):
- `e2e_status` (`planned` | `authored` | `passing` | `N/A` with rationale):
- Tests run:
- Manual checks:
- Known gaps:

## Risks / Blockers

- Risks:
- Blockers:
- Assumptions to carry forward:

## Resume Instructions

- Start here:
- Preserve these constraints:
- Do not redo:
