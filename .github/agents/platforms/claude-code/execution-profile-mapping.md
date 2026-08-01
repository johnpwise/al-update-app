# Claude Code Execution Profile Mapping

## Purpose

Maps the shared, provider-neutral reasoning-demand vocabulary defined in `agents-core/agent-docs/routing/execution-profile-policy.md` onto Claude Code's native model and effort controls. This document is the only place in the repository where concrete Claude model identifiers are named; core and stack-pack policy must remain platform-neutral per `agents-core/agent-docs/routing/execution-profile-schema.md`.

## Scope Boundary

This mapping activates only when the active VS Code extension / host is Claude Code. The repository never chooses between Claude Code and Codex; the active tool determines which platform mapping document applies (see `platforms/codex/execution-profile-mapping.md` for the other).

## Claude Code Effort Scale

This repository defines six named effort levels for Claude Code dispatches, realized using the model and effort/thinking controls available in the active Claude Code session:

| Level | Underlying mechanism |
| --- | --- |
| `Low` | Fastest available model, standard (non-extended) reasoning. |
| `Medium` | Default capable model, standard reasoning. |
| `High` | Default capable model, extended thinking / higher effort enabled. |
| `Extra High` | Highest-capability model, standard-to-extended reasoning. |
| `Max` | Highest-capability model, maximum extended thinking / effort. |
| `Ultracode` | Highest-capability model at maximum effort, plus authorization to use native Claude Code subagent dispatch (the `Agent` tool) for decomposed, coordinated multi-agent execution. |

## Model Classes (Capability-Based)

| Model class | Current model identifier | Typical use |
| --- | --- | --- |
| Fastest | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `Low` effort: mechanical, deterministic, high-volume work. |
| Default capable | Claude Sonnet 5 (`claude-sonnet-5`) | `Medium`/`High` effort: routine-to-complex engineering work. |
| Highest capability | Claude Opus 4.8 (`claude-opus-4-8`) | `Extra High`/`Max`/`Ultracode` effort: intensive, extreme, and orchestrated work. |
| Narrative/creative variant | Claude Fable 5 (`claude-fable-5`) | Available as a subagent model override for narrative/creative-leaning specialist work; not part of the default effort ladder. |

Model identifiers are the current lineup as of this writing and are expected to change over time; treat the model class (fastest / default capable / highest capability) as the stable contract and re-resolve the concrete identifier against the active Claude Code environment at dispatch time.

## Execution Profile Mapping Table

| Shared `reasoning_demand` | Claude Code effort | Default model class | Orchestration behavior |
| --- | --- | --- | --- |
| `lightweight` | `Low` | Fastest | Single agent. |
| `routine` | `Medium` | Default capable | Single agent. |
| `complex` | `High` | Default capable | Single agent. |
| `intensive` | `Extra High` | Highest capability | Single agent. |
| `extreme` | `Max` | Highest capability | Single agent. |
| `orchestrated` | `Ultracode` | Highest capability | Multi-agent: primary dispatches coordinated subagents via the `Agent` tool per the Orchestration Justification Test in `agents-core/agent-docs/routing/reasoning-selection-policy.md`. |

This table provides complete coverage for every shared reasoning-demand level. Every catalogued `execution_profile` in `agents-core/agent-docs/routing/execution-profile-policy.md` resolves to a native Claude Code effort by way of its declared `reasoning_demand`; no shared profile is left unmapped.

## Orchestrated Work Representation

`Ultracode` is both an effort setting and a behavioral execution mode. When a dispatch resolves to `reasoning_demand: orchestrated`:
1. The primary agent operates at `Max`-equivalent single-agent capability as its own floor.
2. The primary agent additionally dispatches independent, coordinated subagents via the `Agent` tool for the genuinely independent workstreams identified by the Orchestration Justification Test.
3. `orchestration_mode: orchestrated` in the Execution Profile Metadata block is satisfied only when native subagent dispatch is actually used, not merely by operating a single agent at `Max` effort.

## Equal-or-Stronger Fallback

When the exact model class or effort setting for an assigned `reasoning_demand` is unavailable in the active Claude Code environment (for example, the highest-capability model is not entitled or is rate-limited):
1. Substitute the next-strongest available model class or effort setting.
2. Never substitute a weaker model class or effort setting than assigned.
3. Record the substitution and its reason in the dispatch's `rationale` field.
4. If no equal-or-stronger option is available at all, treat this as a blocker and escalate to the workflow owner rather than silently proceeding at a weaker setting.

## Agent/Subagent Configuration Guidance

This repository's specialist agents are distributed as plain `.agent.md` instruction files read directly by the active session ("Read and execute: `<path>`"), not as pre-registered native subagent definitions. Apply the mapping as follows:
- When the active Claude Code environment supports native subagent configuration (for example, a `model` field in subagent frontmatter), set that field to the model class resolved from the Execution Profile Mapping Table above.
- When operating via direct prompt-based dispatch (the default for this repository's workflow), communicate the resolved Claude Code effort level as part of the Execution Profile Metadata acknowledgement (for example, "Reasoning Demand: complex → apply Claude Code `High` effort for this dispatch"), and select the corresponding model/effort control manually if the host exposes one (for example, the `/fast` toggle or an explicit model picker).
- Use the `Agent` tool's `subagent_type` and `model` parameters to realize `Ultracode` orchestration; prefer the most specific matching subagent type over `general-purpose` when one exists for the workstream.

## Capability Limits (Explicit)

A prompt alone cannot reconfigure the active primary model or effort setting where the host does not expose that capability. When the active Claude Code environment does not expose manual model/effort selection:
1. Do not claim a profile was applied if it could not be realized.
2. Record the gap explicitly in the dispatch's `rationale` (for example, "assigned `Max`; host does not expose effort control, operating at host default").
3. This limitation never justifies skipping the Execution Profile Metadata block itself; the semantic profile is still selected, recorded, and escalated normally per `agents-core/agent-docs/routing/reasoning-selection-policy.md` even when the underlying platform cannot fully enforce it.
