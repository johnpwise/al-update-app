# Core Agent Execution Profile Defaults

## Purpose

Declares the default `execution_profile` for every core specialist agent, derived from the shared catalogue in [[execution-profile-policy]] and the deterministic selection procedure in [[reasoning-selection-policy]]. `workflow-orchestrator` uses these defaults as the starting point for every dispatch and adjusts per the Selection Procedure before assigning final Execution Profile Metadata.

Stack packs may declare additional stack-specific specialists and profile refinements in their own `agent-docs/routing/model-routing-policy.md`; they must not redeclare or contradict the defaults below.

## Defaults

| Agent | Capability | Default profile | Default reasoning demand | Escalation |
| --- | --- | --- | --- | --- |
| `workflow-orchestrator.agent.md` | `coordination` | `planning-routine` | `routine` | Escalate to `planning-complex` when trigger blocks conflict, required workflow artifacts are missing, or an approval-boundary decision is surfaced. |
| `feature-plan-delivery-orchestrator.agent.md` | `synthesis` | `planning-routine` | `routine` | Escalate to `planning-complex` when scope is ambiguous, multiple viable approaches exist, or a dependency/contract/architecture implication is found. |
| `architecture-planner.agent.md` | `analysis` | `architecture-complex` | `complex` | Escalate to `architecture-intensive` for cross-cutting structural change, new integration boundary, or migration-shaped design; escalate to `architecture-extreme` for multi-system or system-wide, hard-to-reverse decisions. |
| `test-strategy-engineer.agent.md` | `analysis` | `testing-routine` | `routine` | Escalate to `testing-complex` when async races, multiple interacting states, or contested `test_layer_matrix`/`preimplementation_failing_test_evidence` are present. |
| `implementation-engineer.agent.md` | `code-generation` | `implementation-routine` | `routine` | Use `implementation-lightweight` for mechanical, deterministic changes. Escalate to `implementation-complex` for cross-module work or a contract change with several viable approaches; escalate to `implementation-intensive` for authentication, transactions, concurrency, migrations, or broad refactoring. |
| `dependency-governance.agent.md` | `analysis` | `planning-routine` | `routine` | Escalate to `planning-complex` when the proposal affects production runtime, the build pipeline, licensing/compliance posture, or broadly used developer tooling (see the agent's Approval Triggers). |
| `commit-authoring-operator.agent.md` | `verification` | `delivery-lightweight` | `lightweight` | Escalate to `delivery-routine` when push fails, repository state or scope is ambiguous, or a rework loop precedes this dispatch. |
| `pull-request-author-operator.agent.md` | `coordination` | `delivery-routine` | `routine` | Escalate via `workflow-orchestrator` reentry as `awaiting-approval` (do not proceed at this profile) when base-target ambiguity or repository policy requires a decision before PR creation. |

## Application Rule

`workflow-orchestrator` starts from the default profile in this table, then applies the Selection Procedure in [[reasoning-selection-policy]] against the actual dispatch's `risk`, `scope`, `reversibility`, and `verification` signals. The default is a floor for routine cases, not a ceiling: any dispatch may resolve to a higher profile than its default, and a specialist may escalate further per the Escalation Rules in [[reasoning-selection-policy]]. No participant may silently downgrade below the assigned profile.
