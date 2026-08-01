# model-routing-policy.md

## Purpose

This document defines execution-profile routing guidance for the React stack pack, using the shared vocabulary in `agent-docs/routing/execution-profile-schema.md`, `agent-docs/routing/execution-profile-policy.md`, and `agent-docs/routing/reasoning-selection-policy.md`.

Baseline:
- use `routine` reasoning demand for straightforward, localized review or translation tasks
- use `complex` reasoning demand for ambiguous, cross-boundary, or high-impact decisions

---

## Global Routing Rules

Use **`routine`** reasoning demand when all are true:
- scope is narrow and single-purpose
- the change impact is local
- behavior is already clear
- no approval-boundary decision is needed

Use **`complex`** reasoning demand when any are true:
- the request is ambiguous or underspecified
- state ownership is unclear
- component boundaries or hook extraction are debatable
- API contract or nullability is unclear
- accessibility involves modal, focus, or validation complexity
- the test matrix spans async races or multiple UI states
- `test_layer_matrix` decisions (`unit`, `component`, `integration`, `e2e`) are unclear or contested
- `preimplementation_failing_test_evidence` is missing or contradictory

---

## Agent-Specific Defaults

### frontend-code-reviewer.agent.md
Default execution profile: `review-routine` (`reasoning_demand: routine`)

Escalate to `review-complex` (`reasoning_demand: complex`) when:
- the diff is large
- multiple interacting findings exist
- state ownership is questionable
- architectural drift is evident
- test-first evidence gates fail (missing `test_layer_matrix`, missing `preimplementation_failing_test_evidence`, or required `e2e_status` not passing at closeout)

### accessibility-ux-reviewer.agent.md
Default execution profile: `review-routine` (`reasoning_demand: routine`)

Escalate to `review-complex` (`reasoning_demand: complex`) when:
- dialogs or overlays are involved
- multi-step forms or validation flows are involved
- focus restoration is non-trivial
- async recovery paths are complex

### api-contract-modeling.agent.md
Default execution profile: `architecture-complex` (`reasoning_demand: complex`)

Use `planning-routine` (`reasoning_demand: routine`) only for:
- additive field updates with stable transport shapes
- simple request/response extensions with no branching semantics

### react-state-ownership-guardian.agent.md
Default execution profile: `review-complex` (`reasoning_demand: complex`)

Use `review-routine` (`reasoning_demand: routine`) only for:
- narrow ownership checks where the candidates are obvious
- localized local-vs-lifted decisions with little downstream impact

### react-component-composition-reviewer.agent.md
Default execution profile: `review-routine` (`reasoning_demand: routine`)

Escalate to `review-complex` (`reasoning_demand: complex`) when:
- a new shared abstraction is proposed
- component and hook boundaries affect multiple features
- tree-wide prop or context changes are being considered

---

## Escalation Criteria (Cross-Agent)

These conditions require `workflow-orchestrator` to escalate the relevant agent's execution profile (per `agent-docs/routing/reasoning-selection-policy.md`) regardless of which specialist first observes them:

- **Shared client state ownership is contested or spans multiple features** -> escalate `react-state-ownership-guardian.agent.md` to `review-complex` and `implementation-engineer` to `implementation-complex`; treat `capability_owners.shared_client_state_tier: cross_feature` as a corroborating signal.
- **API contract change affects other consumers or has unclear backward compatibility** -> escalate `api-contract-modeling.agent.md` to `architecture-complex` (if not already there) and route to `architecture-planner` at `architecture-complex` or higher.
- **Accessibility complexity involves modal/focus management or multi-step validation flows** -> escalate `accessibility-ux-reviewer.agent.md` to `review-complex`.

A specialist that observes one of these conditions must record it in `Escalation Reason` and must not silently continue at a lower profile.
