# Execution Profile Worked Examples

## Purpose

Five realistic, end-to-end worked examples showing how `workflow-orchestrator` selects an execution profile for every dispatch, how profiles change across the same workflow, how escalation works without silent downgrade, and how a reviewer rework loop runs without bypassing any existing gate.

Every dispatch below is normative in shape only — file paths, agent aliases, and routing metadata match the actual implemented contracts in [[execution-profile-schema]], [[execution-profile-policy]], [[reasoning-selection-policy]], and `core-agent-execution-profile-defaults.md`. The specific scenario text (bug/feature descriptions) is illustrative.

Each example uses this format:
- A summary table: `Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale (one line)`.
- One fully expanded Execution Profile Metadata block for the most illustrative dispatch in that example, in the exact field format defined by [[execution-profile-schema]].
- A short "What this demonstrates" note.

None of these examples skip test-first sequencing, evidence gates, required review gates, or the commit/push gate. Fast-track (trivial) handling still runs `test-strategy-engineer` and required reviewers — it only skips unnecessary re-planning ceremony, never evidence or review.

---

## Example 1: Trivial bug fix

**Scenario:** "Pagination shows one fewer page than exists on the reports table." A reproducible, single-file off-by-one error.

| Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | `workflow-orchestrator` | `planning-routine` | `routine` | — | Bounded, reproducible bug report with clear acceptance criteria. |
| 2 | `feature-plan-delivery-orchestrator` | `planning-routine` | `routine` | — | Trivial fast-track: single-file pagination calculation, no cross-module impact. |
| 3 | `test-strategy-engineer` | `testing-routine` | `routine` | — | One unit test covers the off-by-one boundary; component/integration/e2e are `N/A`. |
| 4 | `implementation-engineer` | `implementation-lightweight` | `lightweight` | — | Deterministic one-line arithmetic correction against a pre-written failing unit test. |
| 5 | `frontend-code-reviewer` | `review-routine` | `routine` | — | Small, single-purpose diff with local impact; no interacting findings. |
| 6 | `commit-authoring-operator` | `delivery-lightweight` | `lightweight` | — | Clean gate status, no explicit PR request. |

Fully expanded metadata for dispatch 4:

```
Execution Profile: implementation-lightweight
Capability: code-generation
Reasoning Demand: lightweight
Risk: low
Scope: local
Reversibility: easily-reversible
Verification: test-backed
Orchestration Mode: single-agent
Rationale: deterministic one-line pagination-count correction against a pre-written failing unit test; no branching logic or cross-module impact.
```

**What this demonstrates:** the trivial fast-track still runs `test-strategy-engineer` and a required reviewer — it fast-tracks planning ceremony, not evidence or review gates — and profiles vary per dispatch even on the smallest possible workflow (`routine` → `routine` → `routine` → `lightweight` → `routine` → `lightweight`).

---

## Example 2: Routine feature

**Scenario:** "Add a CSV export button to the reports table." Well-understood shape, bounded to one feature area, no ambiguous ownership.

| Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | `workflow-orchestrator` | `planning-routine` | `routine` | — | Clear acceptance criteria at intake. |
| 2 | `feature-plan-delivery-orchestrator` | `planning-routine` | `routine` | — | Non-trivial (multi-slice: button, CSV utility, tests) but bounded to one feature area with no ambiguous ownership. |
| 3 | `test-strategy-engineer` | `testing-routine` | `routine` | — | Standard `test_layer_matrix`: `unit` for CSV formatting, `component` for button interaction, `e2e` marked `N/A` (no new page/route). |
| 4 | `implementation-engineer` | `implementation-routine` | `routine` | — | Conventional button plus client-side CSV utility following established component patterns. |
| 5 | `frontend-code-reviewer` | `review-routine` | `routine` | — | Small diff, no interacting findings, no architectural drift. |
| 6 | `accessibility-ux-reviewer` | `review-routine` | `routine` | — | Simple button control; no modal, focus-management, or multi-step validation complexity. |
| 7 | `commit-authoring-operator` | `delivery-lightweight` | `lightweight` | — | Clean gate status, no explicit PR request. |

**What this demonstrates:** `routine` is the correct default for the large majority of dispatches in ordinary feature work — per the Cross-Cutting Rule in [[execution-profile-policy]], escalating beyond `routine` requires explicit risk/scope/reversibility/verification evidence, which this scenario never produces.

---

## Example 3: Architectural change

**Scenario:** "Introduce a shared `notifications` client-state boundary consumed by both the dashboard and settings features." Ownership and lifting strategy are not yet settled between two independently-owned feature areas.

| Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | `workflow-orchestrator` | `planning-routine` | `routine` | — | The intake/routing decision itself is routine even though downstream work is not. |
| 2 | `feature-plan-delivery-orchestrator` | `planning-complex` | `complex` | `planning-routine` | Scoping revealed a cross-feature shared-state ownership question with multiple viable approaches, exceeding a routine single-slice feature. |
| 3 | `architecture-planner` | `architecture-intensive` | `intensive` | `architecture-complex` | New shared client-state integration boundary between two existing feature areas; incorrect boundary placement is costly to unwind later (`risk: high` floors at `intensive`). |
| 4 | `test-strategy-engineer` | `testing-complex` | `complex` | `testing-routine` | Test matrix spans both consuming features plus the new shared store; layer requirements were contested until the architecture-planner boundary decision landed. |
| 5 | `implementation-engineer` | `implementation-complex` | `complex` | `implementation-routine` | Cross-module implementation introducing a new shared store consumed by two features, following the approved boundary. |
| 6 | `react-state-ownership-guardian` | `review-complex` | `complex` | — | This agent's declared default is already `review-complex` for shared client-state ownership decisions; no further escalation needed. |
| 7 | `frontend-code-reviewer` | `review-routine` | `routine` | — | Diff is contained and follows the approved boundary; no interacting findings surfaced. |
| 8 | `commit-authoring-operator` | `delivery-lightweight` | `lightweight` | — | Clean gate status, no explicit PR request. |

Fully expanded metadata for dispatch 3:

```
Execution Profile: architecture-intensive
Capability: analysis
Reasoning Demand: intensive
Risk: high
Scope: cross-module
Reversibility: reversible-with-effort
Verification: review-backed
Orchestration Mode: single-agent
Rationale: new shared client-state integration boundary between two independently-owned feature areas; incorrect boundary placement is costly to unwind once both features depend on it.
Escalated From: architecture-complex
Escalation Reason: boundary decision affects two independently-owned features, not a single bounded module.
```

**What this demonstrates:** escalation cascades through exactly the agents whose signals actually changed (planning, architecture, testing, implementation) while `frontend-code-reviewer` stays at `review-routine` — escalation is per-dispatch based on that dispatch's own risk/scope/reversibility/verification signals, never a blanket elevation of the whole workflow.

---

## Example 4: Automatic mid-dispatch escalation

**Scenario:** "Validation error message doesn't show for an empty email field." Initially scoped as a bounded validation-message fix; the actual root cause is discovered mid-implementation to be in shared authentication middleware.

| Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | `workflow-orchestrator` | `planning-routine` | `routine` | — | Reproducible defect with an apparently bounded, known cause. |
| 2 | `feature-plan-delivery-orchestrator` | `planning-routine` | `routine` | — | Trivial fast-track: expected to be a single-DTO validation fix. |
| 3 | `test-strategy-engineer` | `testing-routine` | `routine` | — | Standard unit coverage for the validation path, as originally scoped. |
| 4 | `implementation-engineer` (initial) | `implementation-routine` | `routine` | — | Expected bounded fix in the request DTO validation layer. |
| 4′ | `implementation-engineer` (escalated, same dispatch) | `implementation-intensive` | `intensive` | `implementation-routine` | Root cause traced into shared authentication middleware stripping the email field before validation runs, not the originally scoped DTO layer. |
| 5 | `backend-code-reviewer` | `review-complex` | `complex` | `review-routine` | Fix touches shared authentication middleware, a cross-cutting layer beyond the originally scoped validation message. |
| 6 | `commit-authoring-operator` | `delivery-lightweight` | `lightweight` | — | Commit mechanics are unaffected by the upstream escalation; push is clean. |

Fully expanded metadata for dispatch 4′ (the escalation moment):

```
Execution Profile: implementation-intensive
Capability: code-generation
Reasoning Demand: intensive
Risk: high
Scope: cross-module
Reversibility: hard-to-reverse
Verification: test-backed
Orchestration Mode: single-agent
Rationale: root cause is in shared authentication middleware stripping the email field before validation runs, not the originally scoped DTO layer; authentication-path changes are high-risk and hard to reverse if wrong.
Escalated From: implementation-routine
Escalation Reason: root cause traced into shared authentication middleware affecting all authenticated requests, not the originally scoped validation-message rendering.
```

Per the backend stack's cross-agent escalation criteria (`model-routing-policy.md`, "Authentication or authorization changes"), `implementation-engineer` escalates itself and the reviewer gate escalates independently to match — `commit-authoring-operator` does **not** inherit the escalation, because nothing about the commit step itself became riskier.

**What this demonstrates:** escalation is scoped to exactly the dispatch(es) whose risk actually changed. `implementation-engineer` never silently continues at `implementation-routine` once it discovers the auth-path root cause (that would be a policy violation per the No-Silent-Downgrade Rule), but downstream steps that remain unaffected are not forced to a higher profile just because an earlier step escalated.

---

## Example 5: Reviewer rework loop

**Scenario:** "Add inline editing to the product-name field in the settings table." First implementation pass lifts local edit state into the shared `appStore` unnecessarily, creating a blocking architectural-drift finding.

| Dispatch | Agent | Execution Profile | Reasoning Demand | Escalated From | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | `workflow-orchestrator` | `planning-routine` | `routine` | — | Bounded feature shape at intake. |
| 2 | `feature-plan-delivery-orchestrator` | `planning-routine` | `routine` | — | Non-trivial but bounded: inline-edit state, validation, one persistence call. |
| 3 | `test-strategy-engineer` | `testing-routine` | `routine` | — | Standard `test_layer_matrix` for a bounded UI change. |
| 4 | `implementation-engineer` (first pass) | `implementation-routine` | `routine` | — | Conventional inline-edit pattern, expected to be local component state. |
| 5 | `react-state-ownership-guardian` | `review-routine` | `routine` | — | Narrow, apparently obvious local-vs-lifted decision at first glance. Passes. |
| 6 | `frontend-code-reviewer` (finding) | `review-complex` | `complex` | `review-routine` | Diff shows local edit-state incorrectly lifted into shared `appStore`, creating cross-component coupling not visible from a routine-level pass. Returns `changes-required` (blocking). |
| 7 | `workflow-orchestrator` (re-entry) | `planning-routine` | `routine` | — | Routing scoped rework back to `implementation-engineer` per the blocking finding; the routing decision itself is routine. |
| 8 | `implementation-engineer` (rework) | `implementation-complex` | `complex` | — | Corrective work requires re-evaluating a state-ownership design decision, not a mechanical patch; assigned directly by `workflow-orchestrator`, not self-escalated. |
| 9 | `frontend-code-reviewer` (re-run) | `review-routine` | `routine` | — | Rework resolved the state-ownership drift; diff is now small and single-purpose with no interacting findings. Passes. |
| 10 | `react-state-ownership-guardian` (re-run) | `review-routine` | `routine` | — | Re-run required because `capability_owners.shared_client_state_owner` scope changed during rework. Confirms pass. |
| 11 | `commit-authoring-operator` | `delivery-lightweight` | `lightweight` | — | Clean gate status after both required gates re-ran green. |

Fully expanded metadata for dispatch 6 (the blocking finding):

```
Execution Profile: review-complex
Capability: verification
Reasoning Demand: complex
Risk: moderate
Scope: module
Reversibility: reversible-with-effort
Verification: review-backed
Orchestration Mode: single-agent
Rationale: local edit-state was lifted into the shared appStore without justification, creating cross-component coupling; architectural drift of this kind requires more than a routine-level pass to characterize correctly before returning a blocking verdict.
Escalated From: review-routine
Escalation Reason: initial routine-level review surfaced an unexpected architectural-drift finding partway through, not visible from the diff's size alone.
```

**What this demonstrates:** a blocking reviewer finding never gets silently waved through, and rework never skips the gates that found the problem — both `frontend-code-reviewer` and `react-state-ownership-guardian` re-run and must both pass before `commit-authoring-operator` is dispatched. The rework dispatch itself is assigned `implementation-complex` directly by `workflow-orchestrator` (not a self-escalation) because the orchestrator, not the specialist, is the one deciding the corrective work's scope this time.

---

## Cross-example takeaways

- `routine` dominates ordinary work; `lightweight` appears for genuinely mechanical steps (delivery, deterministic fixes); `complex`/`intensive` appear only when a dispatch's own risk, scope, reversibility, or verification signal earns it, per the Selection Procedure in [[reasoning-selection-policy]].
- Escalation is always recorded (`escalated_from` + `escalation_reason`) and is never blanket-applied to unrelated downstream dispatches.
- No example above ever skips `test-strategy-engineer`, a required reviewer gate, or `commit-authoring-operator`'s evidence requirements — execution-profile routing changes *how much reasoning effort* a dispatch gets, never *whether* a gate runs.
- `orchestrated`/multi-agent dispatch is deliberately absent from all five examples: none of these scenarios pass the Orchestration Justification Test (genuinely independent, concurrently-verifiable workstreams). See [[execution-profile-policy]]'s `orchestration` activity family for when it applies instead.
