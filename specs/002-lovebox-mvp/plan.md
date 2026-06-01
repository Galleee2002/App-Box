# Implementation Plan: Lovebox Digital MVP

**Branch**: `002-lovebox-mvp` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-lovebox-mvp/spec.md`

## Summary

Deliver the first product feature: **time-locked text capsules** with list, create, and detail flows; **locked vs unlocked** presentation based on temporal unlock; **offline persistence** via SQLite inside `apps/mobile/src/features/lovebox/`. No pairing, GPS, media, notifications, or cloud sync in this slice. Replaces the foundation placeholder on the **Inicio** tab with real Lovebox UI while preserving Container/repository boundaries from `docs/ARCHITECTURE.md`.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.1, React Native 0.81 (Expo SDK 54)

**Primary Dependencies**: Expo Router 6, NativeWind 4, Zustand 5, expo-sqlite 16 (existing from foundation)

**Storage**: SQLite table `capsules` in app database; bootstrap upgraded from `idle` → `ready` after migration in `core/database`

**Testing**: Manual smoke per [quickstart.md](./quickstart.md); `npm run lint` and `npm run typecheck` as gates; optional lightweight unit tests for `isCapsuleLocked` domain helper (not required for MVP closure)

**Target Platform**: iOS first (Expo Go / simulator)

**Project Type**: Mobile app module at `apps/mobile/src/features/lovebox/`

**Performance Goals**: List renders ≤50 capsules without perceptible lag; create/save completes in under 1s on simulator for typical payload sizes

**Constraints**: Offline-only writes; components must not import SQLite; single-device MVP; unlock status derived at read time from `unlockAt` vs device clock

**Scale/Scope**: 3 screens (list, create, detail), 1 SQLite table, ~8–12 new source files in `lovebox/` + route files under `app/lovebox/`

## Constitution Check

*GATE: Passed (workspace rules + `docs/ARCHITECTURE.md`; constitution template not ratified)*

| Gate | Status | Evidence |
|------|--------|----------|
| Screaming Architecture | Pass | All Lovebox code under `src/features/lovebox/` |
| Container / pure component | Pass | Plan assigns persistence to containers + repository only |
| Domain agnostic of SQLite | Pass | `domain/capsule.ts` + mapper in `data/` |
| Keep It Simple | Pass | One table, no sync/auth, no GPS |
| Offline-first | Pass | FR-013; SQLite write path before any future Supabase |
| Data validation | Pass | FR-002/003; empty/whitespace blocked at domain + UI |

**Post-design re-check**: Pass — [data-model.md](./data-model.md) and [contracts/](./contracts/) respect gates.

## Project Structure

### Documentation (this feature)

```text
specs/002-lovebox-mvp/
├── spec.md
├── plan.md              # This file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── navigation.md
│   ├── ui-lovebox.md
│   └── persistence.md
├── checklists/requirements.md
└── tasks.md             # Phase 2 — /speckit-tasks (not created by plan)
```

### Source Code (repository root)

```text
apps/mobile/
├── app/
│   ├── _layout.tsx                    # ADD lovebox stack group
│   ├── (tabs)/
│   │   └── index.tsx                  # REPLACE → Lovebox list container
│   └── lovebox/
│       ├── _layout.tsx                # Stack: list header hidden on push
│       ├── create.tsx                 # Create capsule
│       └── [id].tsx                   # Capsule detail
├── src/
│   ├── core/
│   │   └── database/
│   │       ├── index.ts               # bootstrap runs migrations
│   │       └── migrations/
│   │           └── 001_lovebox_capsules.sql
│   └── features/
│       └── lovebox/
│           ├── domain/
│           │   ├── capsule.ts         # Entity + isLocked(unlockAt, now)
│           │   └── capsuleRepository.ts
│           ├── data/
│           │   ├── capsuleMapper.ts
│           │   └── sqliteCapsuleRepository.ts
│           ├── components/            # Pure UI
│           ├── containers/          # List, Create, Detail
│           └── store/                 # Zustand: list cache + load actions
```

**Structure Decision**: Extend foundation mobile package only. Routes for Lovebox flows live under `app/lovebox/` (stack); **Inicio** tab hosts the list via thin route file delegating to `CapsuleListContainer`. Persistence access is confined to `data/sqliteCapsuleRepository.ts` and containers.

## Complexity Tracking

No constitution violations requiring justification.

## Phase Summary

| Phase | Artifact | Status |
|-------|----------|--------|
| 0 Research | [research.md](./research.md) | Complete |
| 1 Design | [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) | Complete |
| 2 Tasks | tasks.md | Pending — run `/speckit-tasks` |
| 3 Implement | `apps/mobile/src/features/lovebox/` + routes | Pending |

## Implementation Notes (for tasks phase)

1. Run `databaseBootstrap` on app start (root layout or dedicated provider) before Lovebox screens mount.
2. `isCapsuleLocked(unlockAt, now)` lives in `domain/` — single source of truth for list badges and detail mode.
3. List sort: locked capsules by `unlockAt` ascending; unlocked by `unlockAt` descending (documented in data-model).
4. Reuse `getThemeTokens` / semantic NativeWind classes; add presentation primitives (`Button`, `TextInput`) under `presentation/ui/` only if needed by multiple features in this sprint.
