---
description: "Task list for Our Bucket MVP implementation"
---

# Tasks: Our Bucket MVP

**Input**: Design documents from `/specs/003-our-bucket-mvp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in spec — manual acceptance per quickstart.md only; optional unit test for `validateCreateBucketItemInput` excluded from MVP closure.

**Organization**: Tasks grouped by user story (P1 → P2 → P3) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3)

## Path Conventions

- Mobile app root: `apps/mobile/`
- Feature module: `apps/mobile/src/features/wishlist/`
- Routes: `apps/mobile/app/wishlist/`
- Shared UI: `apps/mobile/src/presentation/ui/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature scaffold before persistence and UI work. No new npm packages required (reuses existing UI primitives).

- [x] T001 Create feature scaffold directories under `apps/mobile/src/features/wishlist/` (`domain/`, `data/`, `components/`, `containers/`, `store/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: SQLite migration, domain/repository layer, navigation shell, and store — **MUST complete before any user story**.

**⚠️ CRITICAL**: No user story work until this phase is complete.

- [x] T002 Append `MIGRATION_003` for `bucket_items` table and indexes in `apps/mobile/src/core/database/index.ts` per `data-model.md`
- [x] T003 [P] Implement `BucketItem` entity, `BucketCategory`/`BucketItemStatus` enums, `isBucketItemCompleted`, `validateCreateBucketItemInput`, `getBucketCategoryLabel`, and `sortBucketItems` in `apps/mobile/src/features/wishlist/domain/bucketItem.ts`
- [x] T004 [P] Define `BucketItemRepository` interface and `CreateBucketItemInput` in `apps/mobile/src/features/wishlist/domain/bucketItemRepository.ts` per `contracts/persistence.md`
- [x] T005 [P] Implement row ↔ domain mapping in `apps/mobile/src/features/wishlist/data/bucketItemMapper.ts`
- [x] T006 Implement `sqliteBucketItemRepository` (`list`, `getById`, `create`, `markCompleted`) in `apps/mobile/src/features/wishlist/data/sqliteBucketItemRepository.ts` with list sort policy from `data-model.md`
- [x] T007 [P] Create Zustand `bucketStore` (items, loading, error, `loadItems`) in `apps/mobile/src/features/wishlist/store/bucketStore.ts`
- [x] T008 Register `wishlist` stack group in `apps/mobile/app/_layout.tsx` per `contracts/navigation.md`
- [x] T009 Create wishlist stack layout in `apps/mobile/app/wishlist/_layout.tsx` (titles: `Nuevo plan` for `create`, dynamic for `[id]`)

**Checkpoint**: Foundation ready — repository callable; routes exist; bootstrap `ready`.

---

## Phase 3: User Story 1 — Add a wish list item (Priority: P1) 🎯 MVP

**Goal**: User can create a bucket item with title, description, and category; validation blocks invalid saves; data persists across app restarts.

**Independent Test**: From create flow, save valid item → force-quit app → relaunch → confirm item still exists with same title, description, category, and pending status (via board in US2 or repository read).

### Implementation for User Story 1

- [x] T010 [P] [US1] Implement `CategoryPicker` with four Spanish category chips in `apps/mobile/src/features/wishlist/components/CategoryPicker.tsx` per `contracts/ui-wishlist.md`
- [x] T011 [P] [US1] Implement `CreateBucketItemContainer` (title, description, category, inline errors, save, `SuccessFeedbackOverlay`) in `apps/mobile/src/features/wishlist/containers/CreateBucketItemContainer.tsx`
- [x] T012 [US1] Wire create screen route in `apps/mobile/app/wishlist/create.tsx` delegating to `CreateBucketItemContainer`
- [x] T013 [US1] Add temporary **Nuevo plan** entry point on `apps/mobile/app/(tabs)/playground.tsx` navigating to `/wishlist/create` (replaced by board CTA in US2)
- [x] T014 [US1] On successful save, call `bucketItemRepository.create()` and navigate back to Planes with `SuccessFeedbackOverlay` in `CreateBucketItemContainer.tsx`

**Checkpoint**: User Story 1 complete — create + persist + validation; reopen app retains item.

---

## Phase 4: User Story 2 — Browse my bucket board (Priority: P2)

**Goal**: User sees all plans on the Planes board with empty-state guidance, category labels, and pending/completed indicators in correct sort order.

**Independent Test**: Zero items → empty state with create guidance; with items → each card shows title, category, pending/completed badge; pending group above completed.

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement `BucketEmptyState` in `apps/mobile/src/features/wishlist/components/BucketEmptyState.tsx` (FR-006)
- [x] T016 [P] [US2] Implement `BucketListItem` in `apps/mobile/src/features/wishlist/components/BucketListItem.tsx` (title, categoryLabel, isCompleted, onPress; no cover image)
- [x] T017 [US2] Implement `BucketBoardContainer` (bootstrap gate, `list()`, store sync, empty vs list, create CTA) in `apps/mobile/src/features/wishlist/containers/BucketBoardContainer.tsx`
- [x] T018 [US2] Replace `FoundationScreen` on Planes tab with `BucketBoardContainer` in `apps/mobile/app/(tabs)/playground.tsx`
- [x] T019 [US2] Refresh board on screen focus so status updates after returning from create or detail in `BucketBoardContainer.tsx`
- [x] T020 [US2] Wire `BucketListItem` `onPress` to `router.push(/wishlist/${id})` in `BucketBoardContainer.tsx`

**Checkpoint**: User Story 2 complete — discoverable board with empty state and sort; integrates with US1 persisted data.

---

## Phase 5: User Story 3 — Mark an item as completed (Priority: P3)

**Goal**: User marks a pending item as done from detail, sees completion date, and gets celebratory feedback.

**Independent Test**: Open pending item → mark complete → celebration overlay → item shows completed on board and detail with human-readable completion date.

### Implementation for User Story 3

- [x] T021 [P] [US3] Implement `BucketItemDetail` in `apps/mobile/src/features/wishlist/components/BucketItemDetail.tsx` (description, category, completion date, mark-complete CTA when pending)
- [x] T022 [US3] Implement `BucketItemDetailContainer` (`getById`, `markCompleted`, not-found state, `SuccessFeedbackOverlay` celebration) in `apps/mobile/src/features/wishlist/containers/BucketItemDetailContainer.tsx`
- [x] T023 [US3] Wire detail route in `apps/mobile/app/wishlist/[id].tsx` with dynamic header title from item title
- [x] T024 [US3] Format `completedAt` as human-readable Spanish date on completed items in `BucketItemDetail.tsx`

**Checkpoint**: All three user stories independently functional end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, quality gates, and acceptance validation across stories.

- [x] T025 [P] Add `accessibilityLabel` on pending/completed badges, category chips, and ≥44pt tap targets per `contracts/ui-wishlist.md` in `BucketListItem.tsx` and `CategoryPicker.tsx`
- [x] T026 Run `npm run lint` and `npm run typecheck` in `apps/mobile/` — both must exit 0
- [x] T027 Execute manual acceptance flow in `specs/003-our-bucket-mvp/quickstart.md` (sections 1–6) and record pass/fail
- [x] T028 Confirm no `expo-sqlite` imports under `apps/mobile/src/features/wishlist/components/` (architecture spot-check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; integrates US1 data (can start US2 components in parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Foundational; needs list navigation from US2 for full UX (T020)
- **Polish (Phase 6)**: Depends on US1–US3 for full quickstart

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 (P1) | Foundational only | MVP slice; temporary create entry on Planes until US2 |
| US2 (P2) | Foundational + US1 data optional | Board reads items created in US1 |
| US3 (P3) | Foundational + US2 navigation | Detail opened from board cards |

### Within Each User Story

- Domain validation before container wiring
- Pure components before containers
- Containers before route files
- Story checkpoint before next priority

### Parallel Opportunities

- **Phase 2**: T003 ∥ T004 ∥ T005 ∥ T007 (after T002 migration); T008 ∥ T009 with data layer
- **Phase 3**: T010 ∥ T011
- **Phase 4**: T015 ∥ T016
- **Phase 5**: T021 can start before T022 container wiring
- **Phase 6**: T025 can run alongside T026 prep

---

## Parallel Example: User Story 2

```bash
# Components in parallel:
Task T015: BucketEmptyState.tsx
Task T016: BucketListItem.tsx

# Then sequential:
Task T017: BucketBoardContainer.tsx (depends on T015, T016)
Task T018: app/(tabs)/playground.tsx
Task T019–T020: focus refresh + navigation wiring
```

---

## Parallel Example: Foundational

```bash
# After T002 (migration):
Task T003: domain/bucketItem.ts
Task T004: domain/bucketItemRepository.ts
Task T005: data/bucketItemMapper.ts
Task T007: store/bucketStore.ts

# Then:
Task T006: sqliteBucketItemRepository.ts (needs T003–T005)
Task T008–T009: navigation shell
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical**)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Create item → force-quit → relaunch → verify persistence (SC-002 partial)
5. Demo create flow before board/detail polish

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. Add US1 → Create + persist (MVP core value)
3. Add US2 → Board + empty state (discoverability)
4. Add US3 → Detail + mark complete (emotional payoff)
5. Polish → lint, typecheck, quickstart sign-off

### Parallel Team Strategy

With two developers after Foundational:

- Developer A: US1 (create flow)
- Developer B: US2 components (T015–T016) then container after US1 `create()` exists

US3 starts after US2 list navigation is wired.

---

## Notes

- Do not add `update`, `delete`, or `revertComplete` to `BucketItemRepository` in MVP (per `contracts/persistence.md`)
- `markCompleted` is idempotent when item is already completed
- New items default to `status: pending` with `completedAt: null`
- List sort: pending first (`createdAt` DESC), then completed (`completedAt` DESC)
- Reuse `Button`, `TextField`, and `SuccessFeedbackOverlay` from `src/presentation/ui/` — do not duplicate
- Replace temporary Planes create button (T013) when T018 lands
- No tests generated unless spec adds TDD requirement later
