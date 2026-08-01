# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

This project includes installed agent packs:

- `agents-core`: `.github/agents/agents-core`
- `react-stack-pack`: `.github/agents/react-stack-pack`

## Prompt paths

- Core prompts: `.github/agents/agents-core/agent-docs`
- React prompts: `.github/agents/react-stack-pack/agent-docs`
- Platform execution-profile mappings: `.github/agents/platforms/claude-code/execution-profile-mapping.md`, `.github/agents/platforms/codex/execution-profile-mapping.md`

## Trigger examples

Use agent spec: Workflow-Orchestrator
New Feature

Use agent spec: Workflow-Orchestrator
Bug Fix

IDE/copilot preamble text may appear before the trigger block; the first valid trigger block is authoritative.

## Working With Agents

This repo uses layered workflow guidance from `agents-core` and `react-stack-pack`, with repo-specific rules in root `AGENTS.md`.

Start here:

- [Workflow Orchestrator](./.github/agents/agents-core/agents/workflow-orchestrator.agent.md)
- [Agent Handoff Workflow](./.github/agents/agents-core/agent-docs/workflows/handoff-workflow.md)
- [Handoff Template](./.github/agents/agents-core/agent-docs/templates/handoff-template.md)
- [Workflow Orchestrator Checkpoint Template](./.github/agents/agents-core/agent-docs/templates/checkpoint-template.md)
- [React Feature Workflow Routing](./.github/agents/react-stack-pack/agent-docs/workflows/feature-workflow-routing.md)
- [React Bug Workflow Routing](./.github/agents/react-stack-pack/agent-docs/workflows/bug-workflow-routing.md)
- [Model Routing Policy](./.github/agents/react-stack-pack/agent-docs/routing/model-routing-policy.md)
- [Repo-Level AGENTS](./AGENTS.md)

Workflow defaults:

- `workflow-orchestrator` is the workflow owner.
- Feature workflow intake requires a leading `New Feature` trigger.
- Bug workflow intake requires a leading `Bug Fix` trigger.
- Triggered feature/bug workflow requests run in fail-closed mode until `.agent-workflows/<workflow_id>/index.md` and the first Worker Prompt Package artifact are persisted.
- In fail-closed mode, the first response reports workflow ownership/routing state rather than direct implementation edits.
- Non-`workflow-orchestrator` specialist returns use **Template-Based Handoffs**.
- Default `Return To Agent` is `workflow-orchestrator.agent.md` unless explicitly overridden by an incoming handoff.
- After each accepted specialist handoff, specialists auto-chain directly when routing metadata is `workflow_status: in-progress` and `reentry_reason: none`; otherwise control returns to `workflow-orchestrator`.
- `feature-plan-delivery-orchestrator` classifies `trivial` vs `non-trivial` for both feature and bug workflows.
- `frontend-code-reviewer.agent.md`, `accessibility-ux-reviewer.agent.md`, and `react-component-composition-reviewer.agent.md` are required before closeout when frontend code changes.
- `api-contract-modeling.agent.md` and `react-state-ownership-guardian.agent.md` are conditional risk-triggered gates before closeout when frontend code changes.
- Blocking review findings must route scoped rework to `implementation-engineer`, then rerun required review gates.
- Persist workflow artifacts in `.agent-workflows/<workflow_id>/` and delete that folder after workflow status is `closed`.

## Workflow Prompts

You can initiate the Workflow Orchestrator by starting your prompt with:

- Use agent spec: Workflow-Orchestrator
- `.github/agents/react-stack-pack/agent-docs/prompts/workflow-orchestrator-auto-loop.prompt.md`
