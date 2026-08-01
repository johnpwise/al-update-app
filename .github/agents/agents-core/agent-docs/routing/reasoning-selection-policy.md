# Reasoning Selection Policy

## Purpose

Defines the deterministic procedure for selecting, escalating, and never silently downgrading the `execution_profile` and `reasoning_demand` metadata defined in [[execution-profile-schema]] and [[execution-profile-policy]]. This policy is platform-neutral; it produces shared semantic metadata only and never a concrete model or platform effort label.

## Selection Procedure (Deterministic)

For every specialist dispatch, evaluate signals in this order and select the highest resulting reasoning demand:

1. Determine `risk`:
   - `low` or `moderate` → no elevation
   - `high` → floor of `intensive`
   - `severe` → floor of `extreme`
2. Determine `scope`:
   - `local` or `module` → no elevation
   - `cross-module` → floor of `complex`
   - `system-wide` → floor of `intensive`
3. Determine `reversibility`:
   - `easily-reversible` or `reversible-with-effort` → no elevation
   - `hard-to-reverse` → floor of `intensive`
4. Determine `verification` ambiguity:
   - `deterministic-check` or `test-backed` with an unambiguous expected result → no elevation
   - `review-backed` or `multi-specialist-verification` with contested or incomplete evidence → floor of `complex`
5. Select the matching activity profile from [[execution-profile-policy]] whose default `reasoning_demand` is equal to or higher than the highest floor computed in steps 1-4.
6. If no cataloged profile matches exactly, select the next-higher activity profile in the same activity family; never select a profile lower than the computed floor.
7. Evaluate orchestration justification (below) independently of steps 1-5; orchestration is never inferred from risk, scope, reversibility, or verification signals alone.

## Orchestration Justification Test

Assign `reasoning_demand: orchestrated` and `orchestration_mode: orchestrated` only when all are true:

1. The work decomposes into two or more genuinely independent workstreams (no shared mutable state or sequential dependency between them).
2. Each workstream is independently verifiable on its own evidence.
3. Running the workstreams as coordinated, decomposed specialist dispatches produces materially better coverage, speed, or independence of judgement than one specialist working the same scope sequentially at `extreme` demand.

If any condition fails, use the highest applicable single-agent demand level instead.

## Escalation Rules

1. A specialist may escalate its own dispatch's `reasoning_demand` and `execution_profile` when newly discovered complexity, risk, scope, or reversibility exceeds the assigned profile.
2. Escalation requires recording `escalated_from` and `escalation_reason` in the Execution Profile Metadata block.
3. A specialist must not silently continue work at the originally assigned profile once an escalation trigger (per the activity entries in [[execution-profile-policy]]) is met.
4. A specialist must not silently downgrade a profile assigned by the dispatching orchestrator or a prior escalation; a downgrade requires an explicit, recorded rationale and re-acknowledgement from the dispatching orchestrator.
5. Escalation always moves to the next-higher demand level in the same activity family unless the discovered risk/scope/reversibility signal computes a higher floor per the Selection Procedure, in which case the higher floor applies directly.

## No-Silent-Downgrade Rule

Once a dispatch's `execution_profile` and `reasoning_demand` are assigned and acknowledged, no participant in the workflow (dispatching orchestrator or executing specialist) may reduce them without:
- an explicit, recorded rationale, and
- re-acknowledgement of the revised Execution Profile Metadata block by the executing specialist.

Silent downgrade — continuing execution at a lower demand than assigned or escalated without recorded rationale and re-acknowledgement — is a policy violation.

## Equal-or-Stronger Fallback Rule

When the active platform mapping (defined in a later slice) cannot provide the exact native model/effort combination for an assigned `reasoning_demand`, the platform mapping must substitute the next-stronger available native combination. It must never substitute a weaker one. This document does not define platform mappings; it defines the shared-contract obligation that later platform-specific mapping documents must satisfy.

## Relationship to Existing Fast/High Contract

This policy defines the target shared vocabulary. Core workflow and handoff contracts (`workflow-orchestrator.agent.md`, `handoff-workflow.md`, `handoff-template.md`, core `AGENTS.md`) have migrated to the Execution Profile Metadata contract; the legacy `Reasoning Mode: Fast|High` contract is retained in those documents only as explicitly deprecated compatibility input for resuming pre-update workflow artifacts. Stack-pack model-routing policies still expressed in fast/high terms are migrated to the shared reasoning-demand vocabulary in a later slice of the execution-profile routing implementation plan.
