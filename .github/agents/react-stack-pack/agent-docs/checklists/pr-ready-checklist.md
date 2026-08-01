# pr-ready-checklist.md

Use this checklist before a frontend change is considered PR-ready.

## Behavior
- requested behavior is implemented
- success path is verified
- loading, error, empty, and disabled states are handled where relevant
- obvious edge cases are covered

## Type safety
- no `any`
- no broad casts masking boundary issues
- nullable and optional paths are narrowed intentionally

## State and architecture
- state is owned at the smallest sensible level
- remote data is not duplicated into client state without cause
- components are not performing transport concerns directly

## Tests
- `test_layer_matrix` (`unit`, `component`, `integration`, `e2e`) is explicitly marked `required` or `N/A` with rationale
- `required_preimplementation_tests` (`unit`/`component` and relevant `integration`) were written as failing tests before production code changes
- `preimplementation_failing_test_evidence` is recorded in handoff/checkpoint artifacts
- non-trivial logic has behavior-focused coverage
- tests avoid brittle implementation coupling
- component tests use explicit AAA annotations: `// Arrange`, `// Act`, `// Assert`
- AAA sections are separated by exactly one blank line and stay in strict order
- test names describe scenario and expected outcome
- required `e2e_status` is `passing` before closeout
- commit authoring has completed, commit SHA(s) are recorded, and push-success evidence (command + remote + branch/ref) is recorded
- if a PR was explicitly requested during this workflow, PR authoring has completed with a live PR URL and PR number recorded in workflow artifacts; if no PR was requested, this is not required for closeout
- closeout cleanup runs only after commit push evidence is complete (plus live PR evidence, if a PR was explicitly requested)
- push failures are routed as `blocked` or `awaiting-approval` (not closeout-ready); a failed explicitly-requested PR blocks only that request, never workflow closeout

## Review hygiene
- diff is scoped
- unrelated cleanup is excluded
- new abstractions were introduced only if they earned their cost
- required reviewer gates are complete with no blocking findings
- for frontend code changes, `frontend-code-reviewer.agent.md` is not `changes-required`
- when reviewer feedback triggered rework, implementation and required reviewer reruns are complete

## Accessibility / UX
- controls are semantic
- keyboard path works
- labels and status messages are clear
- focus behavior is acceptable for the flow
- when accessibility-sensitive interactions are in scope, `accessibility-ux-reviewer.agent.md` review is complete
