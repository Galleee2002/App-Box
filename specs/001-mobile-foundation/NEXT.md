# Handoff: First product feature (002)

**Foundation status**: `001-mobile-foundation` — complete when [tasks.md](./tasks.md) polish phase is checked and [quickstart.md](./quickstart.md) validation passes.

## Recommended next spec

| Field | Value |
|-------|-------|
| **Folder** | `specs/002-lovebox-mvp/` |
| **Command** | `/speckit-specify` |
| **Product source** | `docs/SPEC.md` § Feature 1 — Lovebox Digital (time capsule) |
| **Code module** | `apps/mobile/src/features/lovebox/` |

## Why Lovebox first

1. Listed as Feature 1 in product spec.
2. Core differentiator (time capsule) with clear bounded MVP: create capsule, locked state, unlock conditions (temporal first).
3. Exercises offline SQLite + future Supabase sync patterns defined in architecture.

## Prerequisites from foundation (already delivered)

- Expo app shell and tab navigation
- `core/theme`, `core/database` stub
- Feature folder scaffold `lovebox/{components,containers,store}/`
- Lint + typecheck scripts

## Suggested MVP scope for 002 (input for specify)

- List capsules (empty state OK)
- Create capsule: title, text content, temporal unlock date
- Locked vs unlocked UI states (no GPS in MVP unless specified)
- SQLite persistence in `lovebox` feature; no pairing/auth yet

## Commands sequence

```text
/speckit-specify   → specs/002-lovebox-mvp/spec.md
/speckit-plan      → plan.md, research.md, data-model.md, contracts/
/speckit-tasks     → tasks.md
/speckit-analyze   → consistency report (optional)
/speckit-implement → execute tasks
```

Do **not** implement Lovebox business logic until `002` spec and tasks exist.
