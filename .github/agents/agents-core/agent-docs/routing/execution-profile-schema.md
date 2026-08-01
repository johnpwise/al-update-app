# Execution Profile Schema

## Purpose

Defines the platform-neutral metadata schema every specialist dispatch and handoff must carry to describe execution profile, reasoning demand, risk, scope, reversibility, verification, and orchestration mode, independent of any specific AI platform.

This schema is normative for [[execution-profile-policy]] (profile catalogue) and [[reasoning-selection-policy]] (selection/escalation rules). Concrete model names and platform-specific effort labels must never appear in this document or in any core/shared policy that depends on it.

## Execution Profile Metadata Block

Every dispatch and handoff must carry one Execution Profile Metadata block with these fields:

| Field | Required | Allowed values | Meaning |
| --- | --- | --- | --- |
| `execution_profile` | Yes | one catalogued profile name from [[execution-profile-policy]] | the named activity-specific profile assigned to this dispatch |
| `capability` | Yes | `analysis` \| `synthesis` \| `code-generation` \| `verification` \| `coordination` | the class of work the assigned specialist must perform |
| `reasoning_demand` | Yes | `lightweight` \| `routine` \| `complex` \| `intensive` \| `extreme` \| `orchestrated` | the shared semantic demand level |
| `risk` | Yes | `low` \| `moderate` \| `high` \| `severe` | consequence of an undetected mistake in this dispatch |
| `scope` | Yes | `local` \| `module` \| `cross-module` \| `system-wide` | breadth of code/system affected |
| `reversibility` | Yes | `easily-reversible` \| `reversible-with-effort` \| `hard-to-reverse` | cost of undoing this dispatch's output if wrong |
| `verification` | Yes | `deterministic-check` \| `test-backed` \| `review-backed` \| `multi-specialist-verification` | how correctness will be established |
| `orchestration_mode` | Yes | `single-agent` \| `orchestrated` | whether this dispatch is executed by one specialist or decomposed across coordinated specialists |
| `rationale` | Yes | one-line free text | why this profile/demand/mode was selected |
| `escalated_from` | Only when escalated | a prior `execution_profile` name | the profile this dispatch was escalated from |
| `escalation_reason` | Only when escalated | one-line free text | the newly discovered complexity or risk that justified escalation |

### Field Relationships (Required)

1. `reasoning_demand: orchestrated` requires `orchestration_mode: orchestrated`.
2. `orchestration_mode: orchestrated` requires `reasoning_demand: orchestrated`; multi-agent decomposition must never be represented by any other `reasoning_demand` value paired with `orchestration_mode: orchestrated`.
3. Every other `reasoning_demand` value pairs only with `orchestration_mode: single-agent`.
4. `execution_profile` must resolve to a catalogued profile in [[execution-profile-policy]] whose declared default `reasoning_demand` is equal to, or escalated above, the dispatch's `reasoning_demand` per [[reasoning-selection-policy]].
5. `escalated_from` and `escalation_reason` must both be present or both be absent.

## Example Dispatch Metadata (Normative)

Baseline example:

```
Execution Profile: implementation-routine
Capability: code-generation
Reasoning Demand: routine
Risk: moderate
Scope: module
Reversibility: reversible-with-effort
Verification: test-backed
Orchestration Mode: single-agent
Rationale: bounded endpoint addition following an established pattern in this module.
```

Escalated example:

```
Execution Profile: debugging-intensive
Capability: analysis
Reasoning Demand: intensive
Risk: high
Scope: cross-module
Reversibility: hard-to-reverse
Verification: test-backed
Orchestration Mode: single-agent
Rationale: intermittent failure traced into a shared transaction boundary affecting two modules.
Escalated From: debugging-routine
Escalation Reason: root cause found in shared transaction handling, not the originally scoped module.
```

Orchestrated example:

```
Execution Profile: orchestration-multi-specialist-review
Capability: coordination
Reasoning Demand: orchestrated
Risk: high
Scope: system-wide
Reversibility: reversible-with-effort
Verification: multi-specialist-verification
Orchestration Mode: orchestrated
Rationale: security, accessibility, and performance review disciplines apply independently to the same delivered work.
```

## Platform-Neutrality Rule

This schema, and every document that depends on it, must describe capability and reasoning demand only in the semantic vocabulary above. Concrete model names and platform-specific effort labels belong exclusively in platform-specific mapping documents introduced in a later slice of the execution-profile routing implementation plan.
