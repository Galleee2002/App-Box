# Research: Our Bucket MVP

**Feature**: 003-our-bucket-mvp | **Date**: 2026-06-01

## R1 — Persistence technology

**Decision**: `expo-sqlite` with a single `bucket_items` table; repository in `features/wishlist/data/sqliteBucketItemRepository.ts`.

**Rationale**: Same stack as Lovebox MVP; satisfies FR-004/FR-012 and offline-first architecture.

**Alternatives considered**:
- AsyncStorage-only — rejected; weak sorting for pending/completed groups.
- Separate database file — rejected; one app DB with versioned migrations is established.

## R2 — Status representation

**Decision**: Persist `status` (`pending` | `completed`) and optional `completed_at` (ISO-8601 UTC TEXT). Set both on `markCompleted`.

**Rationale**: Completion is a user action, not time-derived (unlike Lovebox lock). FR-008–FR-009 require stable completed state and visible completion date.

**Alternatives considered**:
- Derive completed from a flag only — rejected; need `completed_at` for display without recomputation.

## R3 — Navigation layout

**Decision**: **Planes** tab (`app/(tabs)/playground.tsx`) shows the board; push routes under `app/wishlist/` stack for `create` and `[id]` detail. Register `wishlist` group in root `app/_layout.tsx`.

**Rationale**: Tab already titled **Planes** with flag icon; matches spec assumption. Stack preserves back navigation from create/detail.

**Alternatives considered**:
- Modal-only flows — rejected; detail needs space for description and complete CTA.
- New fourth tab — rejected; foundation already allocated **Planes** for Our Bucket.

## R4 — Category selection

**Decision**: Fixed domain enum `trips | dates | food | milestones` with Spanish display labels in UI; horizontal chip row or segmented control in `CreateBucketItemContainer` (no new npm dependency).

**Rationale**: FR-003; spec disallows custom categories in MVP.

**Alternatives considered**:
- `@react-native-picker/picker` — rejected unless chips prove inaccessible; keep dependency surface minimal.
- Free-text category — rejected; out of spec.

## R5 — Validation rules

**Decision**: Trim title and description; reject if empty after trim; require category on create; default new items to `pending`.

**Rationale**: Matches spec edge cases and global “no empty required fields” rule.

**Alternatives considered**:
- Max length only on UI — rejected; enforce reasonable caps in domain (title 120, description 2000) consistent with Lovebox.

## R6 — List ordering

**Decision**: Fetch all rows; sort in repository or domain read model: **pending** group first (newest `created_at` first), then **completed** (newest `completed_at` first).

**Rationale**: User story P2 acceptance scenario 3.

**Alternatives considered**:
- Single sort by `created_at` only — rejected; buries completed items unpredictably.

## R7 — State management

**Decision**: Zustand store in `features/wishlist/store/` for list snapshot + loading/error; containers call repository then update store.

**Rationale**: Mirrors Lovebox pattern and foundation conventions.

**Alternatives considered**:
- TanStack Query — deferred until API sync feature.

## R8 — Shared UI reuse

**Decision**: Reuse `Button`, `TextField`, and `SuccessFeedbackOverlay` from `src/presentation/ui/`. Wishlist-specific `BucketListItem`, `BucketEmptyState`, `BucketItemDetail` stay in `features/wishlist/components/`.

**Rationale**: research.md R8 from 002 explicitly anticipated wishlist reuse; reduces duplicate primitives.

## R9 — Completion celebration

**Decision**: On successful `markCompleted`, show `SuccessFeedbackOverlay` with celebratory copy (e.g. “¡Lo logramos!”) then refresh board/detail.

**Rationale**: FR-010; lightweight in-app moment without new animation library work.

**Alternatives considered**:
- Full-screen confetti library — rejected; scope creep for MVP.

## R10 — Out of scope confirmation

**Decision**: No `update` (edit), `delete`, `revertComplete`, image fields, partner confirmation, or network calls in repository interface for MVP.

**Rationale**: Explicit in spec Out of Scope.
