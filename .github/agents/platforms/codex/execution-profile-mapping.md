# Codex Execution Profile Mapping

## Purpose

Maps the shared, provider-neutral reasoning-demand vocabulary defined in `agents-core/agent-docs/routing/execution-profile-policy.md` onto Codex's native model and reasoning-effort controls. This document is the only place in the repository where concrete Codex/GPT model identifiers are named; core and stack-pack policy must remain platform-neutral per `agents-core/agent-docs/routing/execution-profile-schema.md`.

## Scope Boundary

This mapping activates only when the active VS Code extension / host is Codex. The repository never chooses between Codex and Claude Code; the active tool determines which platform mapping document applies (see `platforms/claude-code/execution-profile-mapping.md` for the other).

## Codex Effort Scale

This repository defines five named effort levels for Codex dispatches, realized using the model and reasoning-effort controls exposed by the active Codex configuration:

| Level | Underlying mechanism |
| --- | --- |
| `Light` | Smallest/fastest available coding model, minimal reasoning effort. |
| `Medium` | Standard coding model, default reasoning effort. |
| `High` | Standard coding model, elevated reasoning effort. |
| `Extra High` | Extended-reasoning coding model, high reasoning effort. |
| `Ultra` | Extended-reasoning coding model, maximum reasoning effort, plus (for orchestrated work only) authorization to use native Codex multi-agent/sub-task coordination. |

## Model Classes (Capability-Based)

| Model class | Typical use | Configuration note |
| --- | --- | --- |
| Smallest/fastest | `Light` effort: mechanical, deterministic, high-volume work. | Resolve to the smallest coding-capable model available in the active Codex configuration (for example, a "-mini" or equivalent lightweight tier). |
| Standard coding | `Medium`/`High` effort: routine-to-complex engineering work. | Resolve to the default coding model configured for the active Codex environment. |
| Extended reasoning | `Extra High`/`Ultra` effort: intensive, extreme, and orchestrated work. | Resolve to the highest reasoning-effort coding model/configuration available (for example, a model with an elevated `reasoning_effort` or equivalent setting). |

Exact model identifiers and reasoning-effort parameter names are configuration- and version-dependent; treat the model class (smallest/fastest, standard, extended reasoning) as the stable contract and re-resolve the concrete identifier and parameter against the active Codex configuration at dispatch time.

## Execution Profile Mapping Table

| Shared `reasoning_demand` | Codex effort | Default model class | Orchestration behavior |
| --- | --- | --- | --- |
| `lightweight` | `Light` | Smallest/fastest | Single agent. |
| `routine` | `Medium` | Standard coding | Single agent. |
| `complex` | `High` | Standard coding | Single agent. |
| `intensive` | `Extra High` | Extended reasoning | Single agent. |
| `extreme` | `Ultra` | Extended reasoning | Single agent. |
| `orchestrated` | `Ultra` | Extended reasoning | Multi-agent: primary dispatches coordinated sub-tasks/agents via Codex's native multi-agent mechanism per the Orchestration Justification Test in `agents-core/agent-docs/routing/reasoning-selection-policy.md`. |

Codex exposes five native effort levels against six shared reasoning-demand levels. `extreme` and `orchestrated` both resolve to `Ultra` effort; they are distinguished by orchestration behavior only (single agent vs. coordinated multi-agent), never by inventing a sixth, non-existent Codex effort level. This table provides complete coverage for every shared reasoning-demand level. Every catalogued `execution_profile` in `agents-core/agent-docs/routing/execution-profile-policy.md` resolves to a native Codex effort by way of its declared `reasoning_demand`; no shared profile is left unmapped.

## Orchestrated Work Representation

`Ultra` is both an effort setting and, for `orchestrated` dispatches, a behavioral execution mode. When a dispatch resolves to `reasoning_demand: orchestrated`:
1. The primary agent operates at `Ultra` single-agent capability as its own floor (the same floor used for `extreme`).
2. The primary agent additionally dispatches independent, coordinated sub-tasks/agents via Codex's native multi-agent coordination mechanism for the genuinely independent workstreams identified by the Orchestration Justification Test.
3. `orchestration_mode: orchestrated` in the Execution Profile Metadata block is satisfied only when native multi-agent coordination is actually used, not merely by operating a single agent at `Ultra` effort.
4. If the active Codex host does not expose native multi-agent coordination, do not claim `orchestration_mode: orchestrated` was realized; fall back to single-agent `Ultra` execution and record the limitation per Capability Limits below.

## Equal-or-Stronger Fallback

When the exact model class or reasoning-effort setting for an assigned `reasoning_demand` is unavailable in the active Codex environment:
1. Substitute the next-strongest available model class or reasoning-effort setting.
2. Never substitute a weaker model class or reasoning-effort setting than assigned.
3. Record the substitution and its reason in the dispatch's `rationale` field.
4. If no equal-or-stronger option is available at all, treat this as a blocker and escalate to the workflow owner rather than silently proceeding at a weaker setting.

## Agent-Role Configuration Guidance

This repository's specialist agents are distributed as plain `.agent.md` instruction files read directly by the active session ("Read and execute: `<path>`"), the same file format Codex reads via `AGENTS.md`-style conventions. Skills additionally ship a Codex-specific role/interface descriptor at `agents/openai.yaml` alongside each skill's `SKILL.md` (see `skills/commit-and-push/agents/openai.yaml` for the existing pattern); apply the mapping as follows:
- When the active Codex environment supports native agent-role configuration (for example, a `reasoning_effort` or model field in an agent-role descriptor), set that field to the model class and effort resolved from the Execution Profile Mapping Table above.
- When operating via direct prompt-based dispatch (the default for this repository's workflow), communicate the resolved Codex effort level as part of the Execution Profile Metadata acknowledgement (for example, "Reasoning Demand: complex → apply Codex `High` effort for this dispatch"), and select the corresponding model/effort control manually if the host exposes one.
- Use Codex's native multi-agent/sub-task coordination mechanism to realize `orchestrated` dispatches; prefer the most specific matching role over a generic role when one exists for the workstream.

## Capability Limits (Explicit)

A prompt alone cannot reconfigure the active primary model or reasoning-effort setting where the host does not expose that capability. When the active Codex environment does not expose manual model/effort selection:
1. Do not claim a profile was applied if it could not be realized.
2. Record the gap explicitly in the dispatch's `rationale` (for example, "assigned `Ultra`; host does not expose effort control, operating at host default").
3. This limitation never justifies skipping the Execution Profile Metadata block itself; the semantic profile is still selected, recorded, and escalated normally per `agents-core/agent-docs/routing/reasoning-selection-policy.md` even when the underlying platform cannot fully enforce it.
