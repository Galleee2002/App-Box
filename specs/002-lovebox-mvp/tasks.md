---
description: "Task list for Lovebox Digital MVP implementation"
---

# Tasks: Lovebox Digital MVP

**Input**: Design documents from `/specs/002-lovebox-mvp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in spec — manual acceptance per quickstart.md only; optional unit test for `isCapsuleLocked` excluded from MVP closure.

**Organization**: Tasks grouped by user story (P1 → P2 → P3) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3)

## Path Conventions

- Mobile app root: `apps/mobile/`
- Feature module: `apps/mobile/src/features/lovebox/`
- Routes: `apps/mobile/app/lovebox/`
- Shared UI: `apps/mobile/src/presentation/ui/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies and folder scaffold before persistence and UI work.

- [x] T001 Install `@react-native-community/datetimepicker` via `npx expo install @react-native-community/datetimepicker` in `apps/mobile/package.json`
- [x] T002 Create feature scaffold directories under `apps/mobile/src/features/lovebox/` (`domain/`, `data/`, `components/`, `containers/`, `store/`)
- [x] T003 [P] Add shared `Button` primitive in `apps/mobile/src/presentation/ui/Button.tsx` per `contracts/ui-lovebox.md`
- [x] T004 [P] Add shared `TextField` primitive in `apps/mobile/src/presentation/ui/TextField.tsx` per `contracts/ui-lovebox.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: SQLite migration, database bootstrap, domain/repository layer, navigation shell, and store — **MUST complete before any user story**.

**⚠️ CRITICAL**: No user story work until this phase is complete.

- [x] T005 Create capsules migration SQL in `apps/mobile/src/core/database/migrations/001_lovebox_capsules.sql` per `data-model.md`
- [x] T006 Implement migration runner and `databaseBootstrap` state (`idle` → `ready`) in `apps/mobile/src/core/database/index.ts`
- [x] T007 Invoke database bootstrap on app mount from `apps/mobile/app/_layout.tsx` before Lovebox screens load
- [x] T008 [P] Implement `Capsule` entity and `isCapsuleLocked(unlockAt, now)` in `apps/mobile/src/features/lovebox/domain/capsule.ts`
- [x] T009 [P] Define `CapsuleRepository` interface and `CreateCapsuleInput` in `apps/mobile/src/features/lovebox/domain/capsuleRepository.ts` per `contracts/persistence.md`
- [x] T010 [P] Implement row ↔ domain mapping in `apps/mobile/src/features/lovebox/data/capsuleMapper.ts`
- [x] T011 Implement `sqliteCapsuleRepository` (`list`, `getById`, `create`) in `apps/mobile/src/features/lovebox/data/sqliteCapsuleRepository.ts` with list sort policy from `data-model.md`
- [x] T012 [P] Create Zustand `capsuleStore` (items, loading, error, load actions) in `apps/mobile/src/features/lovebox/store/capsuleStore.ts`
- [x] T013 Register `lovebox` stack group in `apps/mobile/app/_layout.tsx` per `contracts/navigation.md`
- [x] T014 Create Lovebox stack layout in `apps/mobile/app/lovebox/_layout.tsx` (titles for `create` and `[id]`)

**Checkpoint**: Foundation ready — repository callable; routes exist; bootstrap `ready`.

---

## Phase 3: User Story 1 — Create a time-locked capsule (Priority: P1) 🎯 MVP

**Goal**: User can create a capsule with title, body, and unlock date/time; validation blocks invalid saves; data persists across app restarts.

**Independent Test**: From create flow, save valid capsule → force-quit app → relaunch → confirm capsule still exists with same title and unlock schedule (via list in US2 or temporary debug read).

### Implementation for User Story 1

- [x] T015 [P] [US1] Add `validateCreateCapsuleInput` (trim, non-empty title/body, required `unlockAt`) in `apps/mobile/src/features/lovebox/domain/capsule.ts`
- [x] T016 [P] [US1] Implement `CreateCapsuleContainer` (form fields, DateTimePicker, save, inline errors, success feedback) in `apps/mobile/src/features/lovebox/containers/CreateCapsuleContainer.tsx`
- [x] T017 [US1] Wire create screen route in `apps/mobile/app/lovebox/create.tsx` delegating to `CreateCapsuleContainer`
- [x] T018 [US1] Add temporary **Nueva cápsula** entry point on `apps/mobile/app/(tabs)/index.tsx` navigating to `/lovebox/create` (replaced by list CTA in US2)
- [x] T019 [US1] On successful save, call `capsuleRepository.create()` and navigate back to Inicio with clear success feedback in `CreateCapsuleContainer.tsx`

**Checkpoint**: User Story 1 complete — create + persist + validation; reopen app retains capsule.

---

## Phase 4: User Story 2 — Browse my capsules (Priority: P2)

**Goal**: User sees all capsules on Inicio with empty state, locked/unlocked indicators, and intuitive sort order.

**Independent Test**: Zero capsules → empty state with create guidance; with capsules → each row shows title + locked/unlocked badge; order matches sort policy.

### Implementation for User Story 2

- [x] T020 [P] [US2] Implement `CapsuleEmptyState` in `apps/mobile/src/features/lovebox/components/CapsuleEmptyState.tsx` (FR-006)
- [x] T021 [P] [US2] Implement `CapsuleListItem` in `apps/mobile/src/features/lovebox/components/CapsuleListItem.tsx` (title, `isLocked`, `unlockAt`, no body)
- [x] T022 [US2] Implement `CapsuleListContainer` (bootstrap gate, `list()`, store sync, empty vs list, create CTA) in `apps/mobile/src/features/lovebox/containers/CapsuleListContainer.tsx`
- [x] T023 [US2] Replace `FoundationScreen` on Inicio tab with `CapsuleListContainer` in `apps/mobile/app/(tabs)/index.tsx`
- [x] T024 [US2] Refresh list on screen focus so lock badges update when time passes in `CapsuleListContainer.tsx`

**Checkpoint**: User Story 2 complete — discoverable list with empty state and sort; integrates with US1 persisted data.

---

## Phase 5: User Story 3 — View locked vs unlocked content (Priority: P3)

**Goal**: Opening a capsule shows locked presentation (hidden body + unlock hint) or unlocked presentation (full body) based on temporal rule.

**Independent Test**: Open future-unlock capsule → body hidden + hint; open past-unlock capsule → full body; revisit after time passes → unlocked without recreate.

### Implementation for User Story 3

- [x] T025 [P] [US3] Implement `LockedCapsuleDetail` in `apps/mobile/src/features/lovebox/components/LockedCapsuleDetail.tsx` (no `body` prop)
- [x] T026 [P] [US3] Implement `UnlockedCapsuleDetail` in `apps/mobile/src/features/lovebox/components/UnlockedCapsuleDetail.tsx`
- [x] T027 [US3] Implement `CapsuleDetailContainer` (`getById`, `isCapsuleLocked` branch, not-found state) in `apps/mobile/src/features/lovebox/containers/CapsuleDetailContainer.tsx`
- [x] T028 [US3] Wire detail route in `apps/mobile/app/lovebox/[id].tsx` with dynamic header title from capsule
- [x] T029 [US3] Wire `CapsuleListItem` `onPress` to `router.push(/lovebox/${id})` in `CapsuleListContainer.tsx`

**Checkpoint**: All three user stories independently functional end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, quality gates, and acceptance validation across stories.

- [x] T030 [P] Add `accessibilityLabel` on locked/unlocked badges and ≥44pt tap targets per `contracts/ui-lovebox.md` in `CapsuleListItem.tsx` and shared `Button.tsx`
- [x] T031 Run `npm run lint` and `npm run typecheck` in `apps/mobile/` — both must exit 0
- [x] T032 Execute manual acceptance flow in `specs/002-lovebox-mvp/quickstart.md` (sections 1–6) and record pass/fail
- [x] T033 Confirm no `expo-sqlite` imports under `apps/mobile/src/features/lovebox/components/` (architecture spot-check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; integrates US1 data (can start after US1 or in parallel if list uses repository only)
- **User Story 3 (Phase 5)**: Depends on Foundational; needs list navigation from US2 for full UX (T029)
- **Polish (Phase 6)**: Depends on US1–US3 for full quickstart

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 (P1) | Foundational only | MVP slice; temporary create entry on Inicio until US2 |
| US2 (P2) | Foundational + US1 data optional | List reads capsules created in US1 |
| US3 (P3) | Foundational + US2 navigation | Detail opened from list items |

### Within Each User Story

- Domain validation before container wiring
- Pure components before containers
- Containers before route files
- Story checkpoint before next priority

### Parallel Opportunities

- **Phase 1**: T003 ∥ T004
- **Phase 2**: T008 ∥ T009 ∥ T010 ∥ T012 (after T005–T007 sequencing for DB)
- **Phase 3**: T015 ∥ T016
- **Phase 4**: T020 ∥ T021
- **Phase 5**: T025 ∥ T026
- **Phase 6**: T030 can run alongside T031 prep

---

## Parallel Example: User Story 2

```bash
# Components in parallel:
Task T020: CapsuleEmptyState.tsx
Task T021: CapsuleListItem.tsx

# Then sequential:
Task T022: CapsuleListContainer.tsx (depends on T020, T021)
Task T023: app/(tabs)/index.tsx
```

---

## Parallel Example: Foundational

```bash
# After T005–T007 (migration + bootstrap):
Task T008: domain/capsule.ts
Task T009: domain/capsuleRepository.ts
Task T010: data/capsuleMapper.ts
Task T012: store/capsuleStore.ts

# Then:
Task T011: sqliteCapsuleRepository.ts (needs T008–T010)
Task T013–T014: navigation shell
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical**)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Create capsule → force-quit → relaunch → verify persistence (SC-002 partial)
5. Demo create flow before list/detail polish

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. Add US1 → Create + persist (MVP core value)
3. Add US2 → List + empty state (discoverability)
4. Add US3 → Detail locked/unlocked (emotional payoff)
5. Polish → lint, typecheck, quickstart sign-off

### Parallel Team Strategy

With two developers after Foundational:

- Developer A: US1 (create flow)
- Developer B: US2 components (T020–T021) then container after US1 `create()` exists

US3 starts after US2 list navigation is wired.

---

## Notes

- Do not add `update`/`delete` to `CapsuleRepository` in MVP (per `contracts/persistence.md`)
- `isCapsuleLocked` uses `unlockAt > now` (strict greater-than)
- Past `unlockAt` at save is allowed → immediately unlocked on read (FR-010)
- No tests generated unless spec adds TDD requirement later
- Replace temporary Inicio create button (T018) when T023 lands
