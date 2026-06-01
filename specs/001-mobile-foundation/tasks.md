# Tasks: Mobile Foundation Sprint

**Input**: Design documents from `/specs/001-mobile-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec — manual smoke + lint/typecheck only.

**Organization**: By user story (P1 → P2 → P3), then polish.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Expo app package and toolchain in monorepo.

- [x] T001 Create `apps/mobile/` Expo Router project with TypeScript in `apps/mobile/package.json`
- [x] T002 [P] Configure path alias `@/` to project root in `apps/mobile/tsconfig.json`
- [x] T003 [P] Add NativeWind in `apps/mobile/tailwind.config.js`, `apps/mobile/global.css`, `apps/mobile/babel.config.js`
- [x] T004 [P] Install core deps (expo-router, zustand, expo-sqlite, @tanstack/react-query) in `apps/mobile/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme and database stub before routes.

**Checkpoint**: Foundation ready — user story routes can be added.

- [x] T005 Create theme tokens in `apps/mobile/src/core/theme/index.ts`
- [x] T006 Create theme Zustand store in `apps/mobile/src/core/theme/store.ts`
- [x] T007 Create `useAppTheme` hook in `apps/mobile/src/core/theme/useAppTheme.ts`
- [x] T008 Create SQLite bootstrap stub in `apps/mobile/src/core/database/index.ts`
- [x] T009 [P] Scaffold feature folders with README placeholders under `apps/mobile/src/features/lovebox/`, `emotional-status/`, `wishlist/`
- [x] T010 [P] Create shared `FoundationScreen` in `apps/mobile/src/presentation/ui/FoundationScreen.tsx`

---

## Phase 3: User Story 1 — Run first iOS baseline app (P1) MVP

**Goal**: Runnable iOS app with tab navigation and placeholder content.

**Independent Test**: `cd apps/mobile && npm run ios` — navigate Inicio, Playground, Ajustes without crash.

- [x] T011 [US1] Configure root stack in `apps/mobile/app/_layout.tsx` with theme sync
- [x] T012 [US1] Configure tab layout in `apps/mobile/app/(tabs)/_layout.tsx` with three tabs
- [x] T013 [P] [US1] Implement home screen in `apps/mobile/app/(tabs)/index.tsx`
- [x] T014 [P] [US1] Implement playground screen in `apps/mobile/app/(tabs)/playground.tsx`
- [x] T015 [P] [US1] Implement settings screen in `apps/mobile/app/(tabs)/settings.tsx`
- [x] T016 [US1] Add modal placeholder in `apps/mobile/app/modal.tsx`

**Checkpoint**: US1 complete — iOS smoke passes.

---

## Phase 4: User Story 2 — Keep architecture consistent (P2)

**Goal**: Folder tree matches `docs/ARCHITECTURE.md`; UI free of persistence imports.

**Independent Test**: Tree inspection + grep confirms no SQLite/Supabase in `src/presentation/ui/` or route files.

- [x] T017 [US2] Document navigation ownership in `apps/mobile/src/presentation/navigation/README.md`
- [x] T018 [P] [US2] Document lovebox slice boundaries in `apps/mobile/src/features/lovebox/components/README.md` (and containers/store)
- [x] T019 [P] [US2] Document emotional-status slice in `apps/mobile/src/features/emotional-status/**/README.md`
- [x] T020 [P] [US2] Document wishlist slice in `apps/mobile/src/features/wishlist/**/README.md`
- [x] T021 [US2] Verify `FoundationScreen` has no imports from `features/` or `core/database`

**Checkpoint**: US2 complete — architecture review passes SC-004.

---

## Phase 5: User Story 3 — Validate developer quality loop (P3)

**Goal**: Lint and typecheck scripts pass on baseline.

**Independent Test**: `npm run lint && npm run typecheck` exit 0.

- [x] T022 [US3] Add `lint` script in `apps/mobile/package.json`
- [x] T023 [US3] Add `typecheck` script in `apps/mobile/package.json`
- [x] T024 [US3] Configure ESLint in `apps/mobile/eslint.config.js`

**Checkpoint**: US3 complete — quality gates green.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Close foundation sprint; remove template debt; document handoff.

- [x] T025 Remove deprecated `expo-router/babel` from `apps/mobile/babel.config.js`
- [x] T026 [P] Remove unused Expo template dirs `apps/mobile/components/` and `apps/mobile/constants/`
- [x] T027 Update ESLint ignores in `apps/mobile/eslint.config.js` after template removal
- [x] T028 [P] Align Expo dependency versions via `npx expo install --fix` in `apps/mobile/`
- [x] T029 Mark spec status Done in `specs/001-mobile-foundation/spec.md`
- [x] T030 Add handoff doc in `specs/001-mobile-foundation/NEXT.md`
- [x] T031 Update agent plan reference in `.cursor/rules/specify-rules.mdc`
- [x] T032 Validate quickstart checklist in `specs/001-mobile-foundation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phases 3–5** (US1–US3 can overlap after Phase 2)
- **Phase 6** after US1–US3

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P2)**: Parallel with US1 once T010 exists
- **US3 (P3)**: Parallel with US1/US2

### Parallel Opportunities

- T003, T004, T009, T010 in parallel during early setup
- T013, T014, T015 in parallel (different route files)
- T018, T019, T020 in parallel (different feature READMEs)

---

## Parallel Example: User Story 1

```bash
# After T012, implement tab screens concurrently:
# T013 → app/(tabs)/index.tsx
# T014 → app/(tabs)/playground.tsx
# T015 → app/(tabs)/settings.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phases 1–2 → theme + stubs
2. Phase 3 (US1) → iOS runnable shell
3. Validate with `npm run ios`

### Incremental Delivery

1. US1 → device smoke
2. US2 → architecture docs + boundaries
3. US3 → lint/typecheck
4. Polish → cleanup + NEXT.md for 002-lovebox-mvp

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 32 |
| **Completed** | 32 |
| **US1 tasks** | 6 |
| **US2 tasks** | 5 |
| **US3 tasks** | 3 |
| **Polish tasks** | 8 |

**MVP scope delivered**: User Story 1 (P1).

**Next command**: `/speckit-specify` for `002-lovebox-mvp` per [NEXT.md](./NEXT.md).
