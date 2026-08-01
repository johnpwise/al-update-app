# Agent Handoff Template

Use this template for every agent-to-agent handoff.

This is mandatory for:
- `workflow-orchestrator` dispatches (**Worker Prompt Packages**)
- all non-`workflow-orchestrator` specialist returns (**Template-Based Handoffs**)

Free-form summaries do not satisfy the handoff contract.
File-first artifact persistence is required for both dispatches and returns.

## Required First Line

The literal first line of every **Worker Prompt Package** and every **Template-Based Handoff** must be:

`Use agent spec: <Agent-Spec-Alias>`

Rules:
- `<Agent-Spec-Alias>` must come from `agent-docs/routing/agent-spec-alias-map.md` (or equivalent core doc path in the active repo layout).
- Path-form agent specs are non-compliant in this line (for example `.github/agents/...`).
- This line must appear before any section headers.

## Header

- **From Agent:**
- **To Agent:**
- **Task Type:** (feature | bug | refactor | review | research)
- **Execution Profile:** (see `Execution Profile Metadata (Required)` below)
- **Date:**
- **Completion Status:** (`ready-for-next-agent` | `needs-changes` | `approval-required` | `blocked`)

## Workflow Context

- **Workflow ID:**
- **Checkpoint Ref:** (optional)
- **Parent Request Summary:**
- **Current Objective:**
- **Routing Metadata (Required For Specialist Handoffs):**
  - `next_agent_alias`: (alias from core alias map; use `Workflow-Orchestrator` for reentry)
  - `workflow_status`: (`in-progress` | `blocked` | `awaiting-approval` | `ready-for-closeout`)
  - `reentry_reason`: (`none` | `blocked` | `approval` | `closeout`)

## Artifact Metadata (Required)

- **Artifact Type:** (`worker-prompt` | `specialist-handoff`)
- **Artifact ID:**
- **Artifact Path (Absolute):**
- **Artifact Path (Repo-Relative):**
- **Workflow Index Path:** (absolute path to `.agent-workflows/<workflow_id>/index.md`)

`Artifact ID` must use the `artifact-NNN` format and match the prefix of the saved artifact filename.

## Execution Profile Metadata (Required)

Use the shared schema in `agent-docs/routing/execution-profile-schema.md` (or equivalent core doc path in the active repo layout). Every dispatch and handoff must set:

- **Execution Profile:** (catalogued profile name from `agent-docs/routing/execution-profile-policy.md`)
- **Capability:** (`analysis` | `synthesis` | `code-generation` | `verification` | `coordination`)
- **Reasoning Demand:** (`lightweight` | `routine` | `complex` | `intensive` | `extreme` | `orchestrated`)
- **Risk:** (`low` | `moderate` | `high` | `severe`)
- **Scope:** (`local` | `module` | `cross-module` | `system-wide`)
- **Reversibility:** (`easily-reversible` | `reversible-with-effort` | `hard-to-reverse`)
- **Verification:** (`deterministic-check` | `test-backed` | `review-backed` | `multi-specialist-verification`)
- **Orchestration Mode:** (`single-agent` | `orchestrated`)
- **Rationale:** (one-line reason)
- **Escalated From:** (optional; prior `Execution Profile` if this dispatch was escalated)
- **Escalation Reason:** (required whenever `Escalated From` is present)

`Reasoning Demand: orchestrated` requires `Orchestration Mode: orchestrated`, and vice versa; no other pairing is valid. See `agent-docs/routing/execution-profile-schema.md` for full field relationship rules.

## Guard Pattern (Required)

Use this block in the worker chat before task execution:

- **Line 1 (required):** `Use agent spec: <Agent-Spec-Alias>`
- **Alias source:** `agent-docs/routing/agent-spec-alias-map.md` (or equivalent core doc path in the active repo layout)
- **Path-form not allowed in line 1:** do not use `.github/agents/...`
- **Do not use any other agent role**
- **Acknowledge Active Agent + Execution Profile before work**
- **Required acknowledgement lines:**
  - `Active Agent: <target>.agent.md`
  - `Execution Profile: <execution_profile>`
  - `Reasoning Demand: <reasoning_demand> (<one-line reason>)`

## Trigger

Why this handoff is happening now.

## Pass

### 1) Scope

- **In Scope Now:**
- **Out of Scope / Deferred:**
- **Files / Areas Likely Involved:**

### 2) Behavior and Acceptance

- **Requested behavior:**
- **Acceptance criteria:**

### 3) Constraints To Preserve

- Existing contracts:
- Approval boundaries:
- Technical or product constraints:
- Non-goals:

### 4) Technical Context

- Known architecture/state constraints:
- Known contract assumptions:

### 5) Test Evidence Contract

- `capability_owners` (stack-defined required keys):
- for frontend slices using `capability_owners.shared_client_state_owner`, include `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) for new/updated slices:
- `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) with `required` or `N/A` plus rationale:
- `required_preimplementation_tests`:
- `preimplementation_failing_test_evidence` (`unit`/`component` and relevant `integration`):
- `e2e_status` (`planned` | `authored` | `passing` | `N/A` with rationale):

### 6) Work Completed

- Summary of analysis or changes:
- Decisions made:
- Assumptions used:

### 7) Evidence

- Tests run:
- Manual checks:
- Validation status:

### 8) Risks / Open Questions

- Remaining risks:
- Unknowns:
- Blockers:

## Expect

Exactly what output or decision is required from the receiving agent.

## Return Contract

- **Return To Agent:** (`workflow-orchestrator.agent.md` by default unless explicitly overridden by incoming handoff)
- **Required Return Payload:**
  - summary of completed work
  - validation/command status
  - blockers and unresolved assumptions
  - recommended next agent and reason
  - routing metadata (`next_agent_alias`, `workflow_status`, `reentry_reason`)

## Specialist Completion Bootstrap Output (Required For Specialist Returns)

After saving a specialist handoff artifact:

- if `workflow_status: in-progress` and `reentry_reason: none`, output this copy/paste-ready block for the next specialist context:
  - `Use agent spec: <next_agent_alias>`
  - `Active Agent: <source_specialist_alias>`
  - `Execution Profile: <execution_profile>`
  - `Reasoning Demand: <reasoning_demand> (<reason>)`
  - `Template-based specialist handoff has been created at:`
  - `<absolute_handoff_path>`
  - `Continue workflow <workflow_id> and auto-run next specialist.`
- otherwise, output this copy/paste-ready block for Workflow-Orchestrator reentry:
  - `Use agent spec: Workflow-Orchestrator`
  - `Active Agent: <source_specialist_alias>`
  - `Execution Profile: <execution_profile>`
  - `Reasoning Demand: <reasoning_demand> (<reason>)`
  - `Template-based specialist handoff has been created for Workflow-Orchestrator at:`
  - `<absolute_handoff_path>`
  - `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Rules:
- `<source_specialist_alias>` must be the executing specialist alias (for example `Frontend-Code-Reviewer`).
- `<absolute_handoff_path>` must be the absolute path to the newly saved `*.handoff.md` artifact.
- `<workflow_id>` must match the workflow id in the handoff metadata.

## Workflow-Orchestrator Completion Bootstrap Output (Required For Workflow-Orchestrator Dispatches)

After saving a workflow-orchestrator worker prompt artifact, output this copy/paste-ready block for the next specialist context:

- `Use agent spec: <target_specialist_alias>`
- `Active Agent: Workflow-Orchestrator`
- `Execution Profile: <execution_profile>`
- `Reasoning Demand: <reasoning_demand> (<reason>)`
- `Workflow-Orchestrator worker prompt has been created for specialist at:`
- `<absolute_prompt_path>`
- `Continue workflow <workflow_id> and auto-dispatch next worker prompt.`

Rules:
- `<target_specialist_alias>` must match the dispatch target alias from the core alias map.
- `<absolute_prompt_path>` must be the absolute path to the newly saved `*.prompt.md` artifact.
- `<workflow_id>` must match the workflow id in the prompt metadata.

## Worker Acknowledgement (Required)

- **Acknowledged Agent:** (must match `To Agent`)
- **Acknowledged Execution Profile:** (must match the assigned `Execution Profile` and `Reasoning Demand`, plus one-line reason)
- **Handshake Status:** (`confirmed` | `missing` | `mismatch`)

## Completion Signal

What should be true when this handoff is considered successfully resolved.

## Attachments (Optional)

- Diffs
- Error output
- Logs
- Review checklist
