# Implementation Plan: Our Bucket MVP

**Branch**: `003-our-bucket-mvp` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-our-bucket-mvp/spec.md`

## Summary

Deliver the second product feature: **shared wish-list board** with create, list, detail, and **mark-as-completed** flows; **pending vs completed** presentation with completion date; **offline persistence** via SQLite inside `apps/mobile/src/features/wishlist/`. No pairing, co-confirmation, cover images, memory photos, archive section, or cloud sync in this slice. Replaces the foundation placeholder on the **Planes** tab (`app/(tabs)/playground.tsx`) while reusing shared presentation primitives from Lovebox (`Button`, `TextField`, `SuccessFeedbackOverlay`).

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.1, React Native 0.81 (Expo SDK 54)

**Primary Dependencies**: Expo Router 6, NativeWind 4, Zustand 5, expo-sqlite 16 (existing); shared UI from `src/presentation/ui/`; Reanimated via existing `SuccessFeedbackOverlay`

**Storage**: SQLite table `bucket_items` in app database (`lovebox.db`); new migration `MIGRATION_003` appended in `core/database/index.ts` (same pattern as capsules migrations 001–002)

**Testing**: Manual smoke per [quickstart.md](./quickstart.md); `npm run lint` and `npm run typecheck` as gates; optional unit test for `validateCreateBucketItemInput` / category enum (not required for MVP closure)

**Target Platform**: iOS first (Expo Go / simulator)

**Project Type**: Mobile app module at `apps/mobile/src/features/wishlist/`

**Performance Goals**: Board renders ≤50 items without perceptible lag; create/complete actions complete in under 1s on simulator for typical payload sizes

**Constraints**: Offline-only writes; components must not import SQLite; single-device MVP; status persisted on complete (not time-derived)

**Scale/Scope**: 3 screens (board, create, detail), 1 SQLite table, ~10–14 new source files in `wishlist/` + route files under `app/wishlist/`

## Constitution Check

*GATE: Passed (workspace rules + `docs/ARCHITECTURE.md`; constitution template not ratified)*

| Gate | Status | Evidence |
|------|--------|----------|
| Screaming Architecture | Pass | All Our Bucket code under `src/features/wishlist/` |
| Container / pure component | Pass | Persistence in containers + repository only |
| Domain agnostic of SQLite | Pass | `domain/bucketItem.ts` + mapper in `data/` |
| Keep It Simple | Pass | One table, no sync/auth, no images |
| Offline-first | Pass | FR-012; SQLite write path before any future API |
| Data validation | Pass | FR-002/003; empty/whitespace blocked at domain + UI |

**Post-design re-check**: Pass — [data-model.md](./data-model.md) and [contracts/](./contracts/) respect gates.

## Project Structure

### Documentation (this feature)

```text
specs/003-our-bucket-mvp/
├── spec.md
├── plan.md              # This file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── navigation.md
│   ├── ui-wishlist.md
│   └── persistence.md
├── checklists/requirements.md
└── tasks.md             # Phase 2 — /speckit-tasks (not created by plan)
```

### Source Code (repository root)

```text
apps/mobile/
├── app/
│   ├── _layout.tsx                    # ADD wishlist stack group
│   ├── (tabs)/
│   │   └── playground.tsx             # REPLACE → Bucket board container
│   └── wishlist/
│       ├── _layout.tsx                # Stack: create + detail
│       ├── create.tsx                 # Create bucket item
│       └── [id].tsx                   # Item detail + complete action
├── src/
│   ├── core/
│   │   └── database/
│   │       └── index.ts               # ADD MIGRATION_003 bucket_items
│   └── features/
│       └── wishlist/
│           ├── domain/
│           │   ├── bucketItem.ts      # Entity, category enum, validation
│           │   └── bucketItemRepository.ts
│           ├── data/
│           │   ├── bucketItemMapper.ts
│           │   └── sqliteBucketItemRepository.ts
│           ├── components/            # Pure UI (cards, empty state)
│           ├── containers/          # Board, Create, Detail
│           └── store/                 # Zustand: list cache + load actions
```

**Structure Decision**: Extend foundation mobile package only. Routes under `app/wishlist/` (stack); **Planes** tab hosts the board via thin route delegating to `BucketBoardContainer`. Code module name remains `wishlist` per `docs/ARCHITECTURE.md`; product name **Our Bucket** in copy.

## Complexity Tracking

No constitution violations requiring justification.

## Phase Summary

| Phase | Artifact | Status |
|-------|----------|--------|
| 0 Research | [research.md](./research.md) | Complete |
| 1 Design | [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) | Complete |
| 2 Tasks | tasks.md | Complete |
| 3 Implement | `apps/mobile/src/features/wishlist/` + routes | Complete |

## Implementation Notes (for tasks phase)

1. Append `MIGRATION_003` to `MIGRATIONS` in `core/database/index.ts` before first wishlist repository call (existing DBs upgrade in place).
2. Category is a fixed enum in domain; UI shows Spanish labels (Viajes, Citas, Comida, Hitos).
3. `markCompleted(id)` sets `status = completed` and `completed_at = now` (UTC ISO); idempotent if already completed.
4. Reuse `SuccessFeedbackOverlay` for create success and completion celebration (FR-010).
5. Board refresh on tab focus so completed state stays visible after returning from detail.
6. List sort: pending first (`created_at` DESC), then completed (`completed_at` DESC) per data-model.
