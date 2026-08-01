# workflow-orchestrator-auto-loop.prompt.md

Use this prompt when you want workflow steps to auto-chain until closeout, with `workflow-orchestrator` reentering only for blockers, approvals, or closeout.

## Bug workflow starter

```text
Run this as true multi-agent workflow execution.
You must delegate to specialists from .github/agents/** as separate worker runs.
Do not collapse specialist steps into one response.

For each step, persist artifacts in .agent-workflows/<workflow_id>/ and return:

Saved Artifact path
Workflow Index path
Fresh Context Bootstrap line
Workflow-Orchestrator or Specialist Completion Bootstrap block
Do not implement until required planner/test-strategy gates are completed.

Use agent spec: Workflow-Orchestrator
Bug Fix
<bug summary>
```

## Feature workflow starter

```text
Run this as true multi-agent workflow execution.
You must delegate to specialists from .github/agents/** as separate worker runs.
Do not collapse specialist steps into one response.

For each step, persist artifacts in .agent-workflows/<workflow_id>/ and return:

Saved Artifact path
Workflow Index path
Fresh Context Bootstrap line
Workflow-Orchestrator or Specialist Completion Bootstrap block
Do not implement until required planner/test-strategy gates are completed.

Use agent spec: Workflow-Orchestrator
New Feature
<feature summary>
```

## Continuation turn template

```text
Continue workflow <workflow_id> and auto-run the next required specialist step.
```
