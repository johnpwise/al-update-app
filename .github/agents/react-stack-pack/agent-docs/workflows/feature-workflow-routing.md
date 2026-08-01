# feature-workflow-routing.md

## Purpose

This document defines React-specific feature workflow routing deltas that overlay `agents-core` feature workflow routing.

Inherit baseline ownership, routing metadata semantics, artifact persistence/index/bootstrap/cleanup behavior, intake/classification flow, and mandatory gate rules from:

- `agents-core/agent-docs/workflows/feature-workflow-routing.md`

## Stack-specific required review gates

- Required post-implementation frontend review gates for React are always required:
  - `Frontend-Code-Reviewer` (`frontend-code-reviewer.agent.md`)
  - `Frontend-Accessibility-Ux-Reviewer` (`accessibility-ux-reviewer.agent.md`)
  - `Frontend-React-Component-Composition-Reviewer` (`react-component-composition-reviewer.agent.md`)

## React-specific conditional specialist trigger

- `Frontend-React-State-Ownership-Guardian` (`react-state-ownership-guardian.agent.md`)
  - Use when owner choice or `capability_owners.shared_client_state_tier` (`subtree` vs `cross_feature`) is unclear.

## Shared conditional specialists (explicitly retained)

- `architecture-planner`
  - Use when ownership, layering, public contracts, or module boundaries are changing or unclear.
- `Frontend-Api-Contract-Modeling` (`api-contract-modeling.agent.md`)
  - Use when request/response/error shapes, nullability, or mapping boundaries are unclear or changing.
- `dependency-governance`
  - Use for new dependencies or material dependency/tooling/runtime changes.

## Required gate reminder (React-specific reviewer set)

- Always-required reviewer gates (`Frontend-Code-Reviewer`, `Frontend-Accessibility-Ux-Reviewer`, `Frontend-React-Component-Composition-Reviewer`) must be complete with no blocking findings before PR-ready closeout.
- Commit authoring must run only after required reviewer gates pass with no blocking findings.
- Commit authoring is complete only after push succeeds and push evidence is recorded.
- `ready-for-closeout` is valid once commit authoring completes with commit SHA(s) and push-success evidence; PR authoring is never required for closeout.
- PR authoring must run only on an explicit, separate PR request, and only after commit authoring is complete and commit SHAs are recorded; it must never be dispatched automatically after commit-and-push.
- When explicitly requested, PR authoring is complete only after live PR creation succeeds and PR URL/number evidence is recorded.
- If push fails, workflow must route `blocked` or `awaiting-approval` (never `ready-for-closeout`). If an explicitly requested PR creation fails, route that request `blocked` or `awaiting-approval` without reopening an already closeout-ready workflow.
- Closeout is incomplete until `.agent-workflows/<workflow_id>/` is deleted and cleanup status is confirmed.
