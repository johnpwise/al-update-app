# Execution Profile Policy

## Purpose

Defines the shared, provider-neutral reasoning-demand vocabulary and the catalogue of activity-specific execution profiles that every dispatch must select from. This document is the canonical source for `reasoning_demand` and `execution_profile` values referenced by [[execution-profile-schema]] and consumed by [[reasoning-selection-policy]].

## Shared Reasoning-Demand Levels

| Demand | Meaning | Typical examples |
| --- | --- | --- |
| `lightweight` | Mechanical, localised and deterministic work. | Version bump, rename, deterministic verification, small documentation correction. |
| `routine` | Normal bounded engineering following established patterns. | Conventional endpoint, component, bounded refactor or straightforward tests. |
| `complex` | Non-trivial reasoning, several viable approaches or cross-module work. | Unknown repository area, cross-module change, non-trivial debugging or contract change. |
| `intensive` | High-risk, cross-cutting or difficult diagnostic work. | Authentication, transactions, concurrency, migrations or broad refactoring. |
| `extreme` | Exceptional system-wide, security-sensitive or highly consequential work. | Multi-system architecture, severe production diagnosis or security-sensitive redesign. |
| `orchestrated` | Work where coordinated specialist decomposition provides material value. | Parallel investigations, independent design evaluation or multi-specialist review. |

`orchestrated` is a behavioural execution mode, not a "harder" single-agent reasoning level: it is valid only when work benefits from decomposition across independently verifiable specialist workstreams. See the Field Relationships in [[execution-profile-schema]] and the Orchestration Justification Test in [[reasoning-selection-policy]].

## Activity-Specific Execution Profile Catalogue

Each profile below declares a default `reasoning_demand`, deterministic entry criteria for when the profile applies, and the trigger that escalates a dispatch to the next-higher demand level within the same activity. All profiles inherit the no-silent-downgrade and equal-or-stronger fallback rules in [[reasoning-selection-policy]].

### exploration

Understanding existing code, requirements, or system behavior with no code changes produced.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `exploration-routine` | `routine` | Locating known patterns or symbols in a familiar area of the codebase. |
| `exploration-complex` | `complex` | Unfamiliar repository area, ambiguous requirements, or reconciling conflicting documentation. |

Escalate to `exploration-complex` when initial findings reveal cross-module coupling or contradictory existing behavior.

### planning

Converting intent into a structured, scoped request.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `planning-routine` | `routine` | Well-understood feature or bug shape with clear acceptance criteria. |
| `planning-complex` | `complex` | Multiple viable approaches, unclear ownership, or missing constraints requiring assumption-making. |

Escalate to `planning-complex` when scoping surfaces an approval-boundary decision (new dependency, new architecture, contract change).

### architecture

Structural or cross-module design decisions.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `architecture-complex` | `complex` | Design decision confined to a bounded set of modules with known precedent. |
| `architecture-intensive` | `intensive` | Cross-cutting structural change, new integration boundary, or migration-shaped design. |
| `architecture-extreme` | `extreme` | Multi-system architecture change or a decision with system-wide, hard-to-reverse consequences. |

Escalate one level when a design decision's blast radius extends beyond the modules originally scoped.

### testing

Defining and authoring pre-implementation and regression test coverage.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `testing-routine` | `routine` | Standard `test_layer_matrix` for a conventional, bounded change. |
| `testing-complex` | `complex` | Async races, multiple interacting UI/system states, or contested `test_layer_matrix` decisions. |

Escalate to `testing-complex` when required test layers are contested or `preimplementation_failing_test_evidence` is missing or contradictory.

### implementation

Producing code changes against an accepted plan and test-first payload.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `implementation-lightweight` | `lightweight` | Deterministic, mechanical change (version bump, rename, small correction). |
| `implementation-routine` | `routine` | Conventional endpoint, component, or bounded refactor following established patterns. |
| `implementation-complex` | `complex` | Cross-module implementation or a contract change with several viable approaches. |
| `implementation-intensive` | `intensive` | Authentication, transactions, concurrency, migrations, or broad refactoring. |

Escalate one level when implementation uncovers risk or scope beyond the assigned profile; never silently continue at the original level.

### debugging

Diagnosing defective or unexpected behavior.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `debugging-routine` | `routine` | Reproducible defect with a known, bounded cause. |
| `debugging-complex` | `complex` | Non-trivial defect requiring cross-module investigation. |
| `debugging-intensive` | `intensive` | Diagnostic work touching concurrency, transactions, or authentication. |
| `debugging-extreme` | `extreme` | Severe production diagnosis with system-wide or security-sensitive impact. |

Escalate immediately when root cause is traced outside the originally scoped module or layer.

### review

Reviewing produced work for correctness, quality, or policy compliance.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `review-routine` | `routine` | Small, single-purpose diff with local impact and no approval-boundary concerns. |
| `review-complex` | `complex` | Large diff, multiple interacting findings, or questionable ownership/architectural drift. |
| `review-orchestrated` | `orchestrated` | Independent review perspectives (for example security, performance, accessibility) provide material value when performed in parallel. |

Escalate to `review-complex` when a routine review surfaces interacting findings or drift; escalate to `review-orchestrated` only when independent, parallel specialist coverage is demonstrably needed.

### verification

Confirming that implemented work satisfies acceptance criteria and evidence gates.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `verification-lightweight` | `lightweight` | Deterministic check (lint, type-check, single test run) with an unambiguous pass/fail result. |
| `verification-routine` | `routine` | Standard test-first evidence and `e2e_status` confirmation for a bounded change. |
| `verification-complex` | `complex` | Verification spans multiple test layers with ambiguous or borderline evidence. |

Escalate to `verification-complex` when required evidence is incomplete, contradictory, or spans unexpected layers.

### delivery

Commit authoring, push, and (when explicitly requested) pull-request authoring.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `delivery-lightweight` | `lightweight` | Standard commit/push with clean gate status and no PR request. |
| `delivery-routine` | `routine` | Explicit PR authoring request, or commit/push following a rework loop. |

Escalate to `delivery-routine` when push fails, requires investigation, or an explicit PR request is present.

### orchestration

Coordinated multi-specialist decomposition where independent workstreams provide material value over one specialist working sequentially.

| Profile | Default demand | Entry criteria |
| --- | --- | --- |
| `orchestration-parallel-investigation` | `orchestrated` | Independent investigations (for example multiple candidate root causes) can proceed concurrently without shared state conflicts. |
| `orchestration-independent-design-evaluation` | `orchestrated` | Multiple viable architectural approaches warrant independent evaluation before a decision. |
| `orchestration-multi-specialist-review` | `orchestrated` | Multiple review disciplines (for example security, accessibility, performance) apply independently to the same delivered work. |

Orchestrated profiles require a demonstrable decomposition benefit and genuinely independent workstreams; see the Orchestration Justification Test in [[reasoning-selection-policy]].

## Cross-Cutting Rule

`routine` is the default assumption for bounded implementation and review work. Selecting `intensive`, `extreme`, or `orchestrated` requires explicit risk, scope, reversibility, or verification evidence recorded in the dispatch's Execution Profile Metadata block, per [[reasoning-selection-policy]].
