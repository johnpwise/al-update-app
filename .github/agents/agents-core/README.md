# Agents Core Pack

This pack is the first-pass shared core layer for multi-agent development workflows.

## Intended layering

`agents-core` -> stack pack (`agents-react`, `agents-node-express`, etc.) -> repo-local overlay

The core pack owns reusable workflow fundamentals:
- prompt orchestration
- delivery planning
- architecture planning
- implementation execution
- test strategy
- dependency governance
- shared handoff and checkpoint templates

Stack packs should add stack-specific specialist agents and policy. Repo-local overlays should add project facts, exceptions, and approval boundaries.

## Included in this pack

### Agents
- `workflow-orchestrator.agent.md`
- `feature-plan-delivery-orchestrator.agent.md`
- `architecture-planner.agent.md`
- `implementation-engineer.agent.md`
- `test-strategy-engineer.agent.md`
- `dependency-governance.agent.md`
- `commit-authoring-operator.agent.md`
- `pull-request-author-operator.agent.md`

### Docs
- `routing/agent-spec-alias-map.md`
- `routing/execution-profile-schema.md`
- `routing/execution-profile-policy.md`
- `routing/reasoning-selection-policy.md`
- `routing/core-agent-execution-profile-defaults.md`
- `routing/execution-profile-worked-examples.md`
- `workflows/handoff-workflow.md`
- `workflows/feature-workflow-routing.md`
- `workflows/bug-workflow-routing.md`
- `standards/architecture/frontend-state-ownership-standards.md`
- `templates/handoff-template.md`
- `templates/workflow-artifact-index-template.md`
- `templates/feature-request-template.md`
- `templates/bug-report-template.md`
- `templates/checkpoint-template.md`

## Usage

1. Pull in `agents-core` first as the workflow backbone.
2. Add one or more stack packs for framework or domain-specific guidance.
3. Keep repo facts and exceptions in the local repo `AGENTS.md`.
4. In repo-local overlays, map stack-defined `capability_owners` keys and `test_layer_matrix` execution to concrete package/tool choices.
5. For frontend stacks using `capability_owners.shared_client_state_owner`, include `capability_owners.shared_client_state_tier` (`subtree` | `cross_feature`) in new/updated frontend slices.
6. Use core handoff and checkpoint templates to keep workflows resumable and reviewable.
7. Require every specialist return to be a **Template-Based Handoff** using the core `handoff-template.md`.
8. Keep `workflow-orchestrator` as default return target unless the active handoff explicitly overrides it.
9. Keep stack-specific or repo-specific rules out of `agents-core` unless they are truly cross-stack.
10. Persist workflow artifacts to `.agent-workflows/<workflow_id>/` and route fresh contexts by index-resolved absolute prompt paths.
11. Delete `.agent-workflows/<workflow_id>/` after closeout to prevent artifact buildup.
12. Select an execution profile (`routing/execution-profile-schema.md`, `routing/execution-profile-policy.md`, `routing/reasoning-selection-policy.md`) alongside the agent alias for every dispatch; profiles may vary between successive dispatches in one workflow and must never be silently downgraded once assigned.
13. Resolve execution profiles to a native model/effort via the active platform's own mapping doc (`platforms/claude-code/execution-profile-mapping.md` or `platforms/codex/execution-profile-mapping.md`, installed as siblings of this pack) — this pack itself stays platform-neutral and never names a concrete model.

## Adoption notes

When downstream repos upgrade workflow behavior, copy these core files together to avoid mixed policy states:

- if a stack overlay enforces feature/bug intake triggers (for example `New Feature` and `Bug Fix`), update `agents/workflow-orchestrator.agent.md` together with that stack's feature-routing/feature-intake and bug-routing/bug-intake docs

Copy these files together:

- `agent-docs/workflows/feature-workflow-routing.md`
- `agent-docs/workflows/bug-workflow-routing.md`
- `agent-docs/workflows/handoff-workflow.md`
- `agent-docs/templates/handoff-template.md`
- `agent-docs/templates/bug-report-template.md`
- `agents/workflow-orchestrator.agent.md`
- `agents/implementation-engineer.agent.md`
- `AGENTS.md`

Also keep these together whenever the shared execution-profile contract changes, since `workflow-orchestrator.agent.md` and `handoff-template.md` require the fields they define:

- `agent-docs/routing/execution-profile-schema.md`
- `agent-docs/routing/execution-profile-policy.md`
- `agent-docs/routing/reasoning-selection-policy.md`
- `agent-docs/routing/core-agent-execution-profile-defaults.md`
- `../platforms/claude-code/execution-profile-mapping.md` and `../platforms/codex/execution-profile-mapping.md` (siblings of this pack, not inside it) — update whenever the shared reasoning-demand levels change, so every level still resolves on both platforms

## Design notes

This first pass is intentionally conservative:
- it preserves `workflow-orchestrator` ownership for intake/reentry/closeout while permitting direct specialist chaining on happy paths
- it keeps core guidance stack-neutral
- it favors small slices, explicit approvals, and reversible changes
- it separates reusable process standards from stack and repo policy
