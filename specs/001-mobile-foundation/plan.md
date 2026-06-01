# Implementation Plan: Mobile Foundation Sprint

**Branch**: `001-mobile-foundation` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-mobile-foundation/spec.md`

## Summary

Establish an iOS-first Expo/React Native shell with tab navigation, architecture-aligned folders (`core`, `features`, `presentation`), global theme tokens (NativeWind + Zustand), and baseline quality gates (`lint`, `typecheck`). No business features in this sprint; the outcome is a validated foundation ready for `/speckit-specify` on **002-lovebox-mvp** (first product module per `docs/SPEC.md`).

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.1, React Native 0.81 (Expo SDK 54)

**Primary Dependencies**: Expo Router 6, NativeWind 4, Zustand 5, TanStack Query 5 (reserved for sync), expo-sqlite 16, react-native-reanimated 4

**Storage**: SQLite bootstrap stub in `apps/mobile/src/core/database/` (schema deferred to feature specs)

**Testing**: Manual smoke on iOS simulator; `npm run lint` and `npm run typecheck` as automated gates (no unit test suite in foundation scope)

**Target Platform**: iOS first (Expo Go / simulator); Android and web secondary

**Project Type**: Mobile monorepo app at `apps/mobile/`

**Performance Goals**: Cold navigation between tabs without blank states; Metro bundle succeeds on first run

**Constraints**: Offline-first architecture per `docs/ARCHITECTURE.md`; no Supabase or domain logic in foundation; components must not import persistence

**Scale/Scope**: 3 placeholder screens, 3 feature module stubs, 1 shared UI primitive (`FoundationScreen`)

## Constitution Check

*GATE: Passed (project constitution template not ratified; gates enforced via workspace rules + `docs/ARCHITECTURE.md`)*

| Gate | Status | Evidence |
|------|--------|----------|
| Screaming Architecture (features, not layers) | Pass | `apps/mobile/src/features/{lovebox,emotional-status,wishlist}/` |
| Container / pure component separation | Pass | `FoundationScreen` is pure; routes are thin |
| Domain agnostic of SQLite/Supabase in UI | Pass | No data access in `components/` or route files |
| Keep It Simple | Pass | No auth, sync, or business entities in foundation |
| iOS-first onboarding | Pass | `npm run ios` documented in quickstart |

**Post-design re-check**: Pass — design artifacts align with implemented tree.

## Project Structure

### Documentation (this feature)

```text
specs/001-mobile-foundation/
├── spec.md
├── plan.md              # This file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── navigation.md
│   └── ui-foundation.md
├── tasks.md
├── checklists/requirements.md
└── NEXT.md              # Handoff to 002-lovebox-mvp
```

### Source Code (repository root)

```text
apps/mobile/
├── app/                          # Expo Router (presentation/navigation host)
│   ├── _layout.tsx               # Root stack + theme sync
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar (Inicio, Playground, Ajustes)
│   │   ├── index.tsx
│   │   ├── playground.tsx
│   │   └── settings.tsx
│   └── modal.tsx
├── src/
│   ├── core/
│   │   ├── theme/                # Tokens, Zustand store, hooks
│   │   └── database/             # SQLite bootstrap placeholder
│   ├── features/
│   │   ├── lovebox/              # Stub: components/, containers/, store/
│   │   ├── emotional-status/
│   │   └── wishlist/
│   └── presentation/
│       └── ui/                   # FoundationScreen, future design system
├── global.css
├── tailwind.config.js
└── package.json                  # scripts: ios, lint, typecheck
```

**Structure Decision**: Mobile-only monorepo package. Routing lives in `app/` per Expo Router convention; shared UI and future cross-feature primitives live under `src/presentation/`. Feature business code will land under `src/features/<module>/` per `docs/ARCHITECTURE.md`.

## Complexity Tracking

No constitution violations requiring justification.

## Phase Summary

| Phase | Artifact | Status |
|-------|----------|--------|
| 0 Research | [research.md](./research.md) | Complete |
| 1 Design | [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) | Complete |
| 2 Tasks | [tasks.md](./tasks.md) | Complete |
| 3 Implement | `apps/mobile/` | Complete (retroactively tracked) |

## Next Feature

After all tasks in `tasks.md` are checked and quickstart validation passes, start **`specs/002-lovebox-mvp/`** via `/speckit-specify` using Feature 1 from `docs/SPEC.md` (Lovebox Digital / time capsule). See [NEXT.md](./NEXT.md).
