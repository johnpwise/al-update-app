# Agent Spec Alias Map

This is the canonical alias map for `Use agent spec: <Agent-Spec-Alias>`.

Rules:
- Aliases are globally unique across core and stack packs.
- Aliases use Title-Hyphenated format.
- `Use agent spec` must use aliases only; path-form is non-compliant for that line.
- Paths below use `.github/agents/...` as canonical notation and may resolve through equivalent active repo layout paths.

| Alias | Agent spec path |
| --- | --- |
| `Workflow-Orchestrator` | `.github/agents/agents-core/agents/workflow-orchestrator.agent.md` |
| `Feature-Plan-Delivery-Orchestrator` | `.github/agents/agents-core/agents/feature-plan-delivery-orchestrator.agent.md` |
| `Architecture-Planner` | `.github/agents/agents-core/agents/architecture-planner.agent.md` |
| `Test-Strategy-Engineer` | `.github/agents/agents-core/agents/test-strategy-engineer.agent.md` |
| `Implementation-Engineer` | `.github/agents/agents-core/agents/implementation-engineer.agent.md` |
| `Dependency-Governance` | `.github/agents/agents-core/agents/dependency-governance.agent.md` |
| `Commit-Authoring-Operator` | `.github/agents/agents-core/agents/commit-authoring-operator.agent.md` |
| `Pull-Request-Author-Operator` | `.github/agents/agents-core/agents/pull-request-author-operator.agent.md` |
| `Backend-Api-Contract-Modeling` | `.github/agents/node-express-stack-pack/agents/api-contract-modeling.agent.md` |
| `Backend-Code-Reviewer` | `.github/agents/node-express-stack-pack/agents/backend-code-reviewer.agent.md` |
| `Backend-Error-Handling-And-Observability-Reviewer` | `.github/agents/node-express-stack-pack/agents/error-handling-and-observability-reviewer.agent.md` |
| `Backend-Persistence-And-Transaction-Reviewer` | `.github/agents/node-express-stack-pack/agents/persistence-and-transaction-reviewer.agent.md` |
| `Backend-Route-Handler-Boundary-Guardian` | `.github/agents/node-express-stack-pack/agents/route-handler-boundary-guardian.agent.md` |
| `Backend-Ts-Api-Contract-Modeling` | `.github/agents/node-express-ts-stack-pack/agents/api-contract-modeling.agent.md` |
| `Backend-Ts-Code-Reviewer` | `.github/agents/node-express-ts-stack-pack/agents/backend-code-reviewer.agent.md` |
| `Backend-Ts-Error-Handling-And-Observability-Reviewer` | `.github/agents/node-express-ts-stack-pack/agents/error-handling-and-observability-reviewer.agent.md` |
| `Backend-Ts-Persistence-And-Transaction-Reviewer` | `.github/agents/node-express-ts-stack-pack/agents/persistence-and-transaction-reviewer.agent.md` |
| `Backend-Ts-Route-Handler-Boundary-Guardian` | `.github/agents/node-express-ts-stack-pack/agents/route-handler-boundary-guardian.agent.md` |
| `Frontend-Api-Contract-Modeling` | `.github/agents/react-stack-pack/agents/api-contract-modeling.agent.md` |
| `Frontend-Code-Reviewer` | `.github/agents/react-stack-pack/agents/frontend-code-reviewer.agent.md` |
| `Frontend-Accessibility-Ux-Reviewer` | `.github/agents/react-stack-pack/agents/accessibility-ux-reviewer.agent.md` |
| `Frontend-React-State-Ownership-Guardian` | `.github/agents/react-stack-pack/agents/react-state-ownership-guardian.agent.md` |
| `Frontend-React-Component-Composition-Reviewer` | `.github/agents/react-stack-pack/agents/react-component-composition-reviewer.agent.md` |
| `Frontend-Vue-Api-Contract-Modeling` | `.github/agents/vue-stack-pack/agents/api-contract-modeling.agent.md` |
| `Frontend-Vue-Code-Reviewer` | `.github/agents/vue-stack-pack/agents/frontend-code-reviewer.agent.md` |
| `Frontend-Vue-Accessibility-Ux-Reviewer` | `.github/agents/vue-stack-pack/agents/accessibility-ux-reviewer.agent.md` |
| `Frontend-Vue-State-Ownership-Guardian` | `.github/agents/vue-stack-pack/agents/vue-state-ownership-guardian.agent.md` |
| `Frontend-Vue-Component-Composition-Reviewer` | `.github/agents/vue-stack-pack/agents/vue-component-composition-reviewer.agent.md` |
