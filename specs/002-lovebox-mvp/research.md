# Research: Lovebox Digital MVP

**Feature**: 002-lovebox-mvp | **Date**: 2026-06-01

## R1 — Persistence technology

**Decision**: `expo-sqlite` with a single `capsules` table; repository implementation in `features/lovebox/data/sqliteCapsuleRepository.ts`.

**Rationale**: Already in foundation dependencies; matches offline-first pillar in `docs/ARCHITECTURE.md` and spec FR-004/FR-013.

**Alternatives considered**:
- AsyncStorage-only — rejected; poor query/sort support for list ordering.
- WatermelonDB — rejected; over-engineering for one entity in MVP.

## R2 — Locked state representation

**Decision**: Do **not** persist `status` column; derive `locked | unlocked` at read time by comparing `unlockAt` (ISO-8601 UTC stored as TEXT) to `Date.now()` in `domain/capsule.ts`.

**Rationale**: Avoids stale state when device clock passes unlock time; satisfies FR-007–FR-010 and edge case “unlock in past at save”.

**Alternatives considered**:
- Persisted enum updated by background job — rejected; no notifications/background scope in MVP.
- Stored `is_unlocked` flag set once — rejected; would not auto-update without extra logic.

## R3 — Navigation layout

**Decision**: **Inicio** tab (`app/(tabs)/index.tsx`) shows capsule list; push routes under `app/lovebox/` stack for create and `[id]` detail. Register `lovebox` group in root `app/_layout.tsx`.

**Rationale**: Lovebox is primary product (Feature 1); replaces foundation placeholder without adding a fourth tab. Stack preserves back navigation from create/detail.

**Alternatives considered**:
- Dedicated Lovebox tab — rejected; duplicates Inicio purpose.
- Modal-only create — rejected; detail needs full screen for locked/unlocked UX.

## R4 — Date/time capture for unlock

**Decision**: Use `@react-native-community/datetimepicker` (install via `npx expo install`) with platform-native picker in `CreateCapsuleContainer`; store UTC ISO string in SQLite.

**Rationale**: Spec requires date **and** time; native picker is accessible and familiar on iOS.

**Alternatives considered**:
- Text-only date fields — rejected; error-prone parsing and poor UX.
- Minimum custom calendar component — rejected; scope creep for MVP.

## R5 — Validation rules

**Decision**: Trim title and body; reject if empty after trim; require `unlockAt`; if `unlockAt <= now` at save, still persist and treat as unlocked on read (FR-010).

**Rationale**: Matches spec edge cases and global acceptance criterion “no empty required fields”.

**Alternatives considered**:
- Block past unlock dates — rejected; spec says treat as immediately unlocked.

## R6 — List ordering

**Decision**: SQL `ORDER BY` with two-tier sort: locked first (`unlockAt` ASC among rows where `unlockAt > now`), then unlocked (`unlockAt` DESC). Implement via query or in-memory sort after fetch if SQL expression is awkward in SQLite.

**Rationale**: Satisfies user story P2 acceptance scenario 3.

## R7 — State management

**Decision**: Zustand store in `features/lovebox/store/` holds list snapshot + loading/error flags; containers call repository then update store.

**Rationale**: Consistent with foundation theme store and architecture `store/` folder; TanStack Query deferred until Supabase sync feature.

**Alternatives considered**:
- React Context only — rejected; project standard is Zustand per module.

## R8 — Shared UI primitives

**Decision**: Add minimal `Button` and `TextField` under `src/presentation/ui/` if Lovebox forms need them; Lovebox-specific cards (`CapsuleListItem`, empty state, locked detail) stay in `features/lovebox/components/`.

**Rationale**: Keeps feature components pure; shared inputs reusable for wishlist/MoodSync later.

## R9 — Out of scope confirmation

**Decision**: No Supabase, no pairing, no expo-notifications, no image picker, no edit/delete endpoints in repository interface for MVP.

**Rationale**: Explicit in spec Out of Scope; reduces task surface for 002.
