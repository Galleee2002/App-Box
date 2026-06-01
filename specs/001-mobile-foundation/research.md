# Research: Mobile Foundation Sprint

**Feature**: 001-mobile-foundation | **Date**: 2026-06-01

## R1 — Mobile framework choice

**Decision**: Expo SDK 54 + Expo Router 6 (file-based routing in `app/`).

**Rationale**: Aligns with team web/TS skills, fast iOS simulator loop, and documented stack in `docs/ARCHITECTURE.md`.

**Alternatives considered**:
- Bare React Native CLI — rejected for slower onboarding and more native tooling.
- Flutter — rejected; team standard is React/TypeScript.

## R2 — Styling approach

**Decision**: NativeWind 4 with `global.css`, semantic color tokens in `tailwind.config.js`, programmatic tokens in `src/core/theme/`.

**Rationale**: Matches “Tailwind-like” workflow from web; supports light/dark via class strategy and Zustand-driven `setColorScheme`.

**Alternatives considered**:
- StyleSheet-only — rejected; inconsistent with design-system direction in `docs/DESIGN_SYSTEM_FOUNDATIONS.md`.
- Tamagui — rejected; unnecessary abstraction for foundation sprint.

## R3 — Navigation pattern

**Decision**: Bottom tabs for primary foundation screens; root `Stack` for modal route.

**Rationale**: Satisfies FR-002 (≥3 placeholder screens) and matches future product tab shell.

**Alternatives considered**:
- Drawer-only — rejected; not aligned with couples app primary flows.

## R4 — State management baseline

**Decision**: Zustand for global theme mode; TanStack Query installed but unused until sync features.

**Rationale**: Lightweight store for cross-cutting UI; query client reserved for Supabase sync in feature specs.

## R5 — Local persistence bootstrap

**Decision**: `expo-sqlite` dependency + `databaseBootstrap` status stub; no schema in foundation.

**Rationale**: Week 1 excludes business data; feature 002 will define Lovebox tables and migrations.

## R6 — Quality gates

**Decision**: ESLint (`eslint-config-expo`) + `tsc --noEmit` scripts in `apps/mobile/package.json`.

**Rationale**: Satisfies US3/FR-006 without adding Jest/Detox overhead in sprint 1.

## R7 — Babel / Expo Router

**Decision**: Use `babel-preset-expo` only; remove deprecated `expo-router/babel` plugin.

**Rationale**: Expo SDK 50+ deprecates separate router Babel plugin; removes Metro warning noise.

## R8 — Legacy Expo template cleanup

**Decision**: Remove unused `apps/mobile/components/` and `apps/mobile/constants/` from template scaffold.

**Rationale**: Prevents accidental imports outside `src/` architecture; ESLint ignores no longer needed.
