# Quickstart: Lovebox Digital MVP

**Feature**: 002-lovebox-mvp | **Target**: iOS simulator

**Prerequisites**: Foundation complete ([001 quickstart](../001-mobile-foundation/quickstart.md)).

## Install (if needed)

```bash
cd apps/mobile
npm install
npx expo install @react-native-community/datetimepicker
```

## Run

```bash
npm run ios
```

## Manual acceptance flow

### 1. Empty state (FR-006, SC-005)

1. Fresh install or cleared app data (delete app from simulator).
2. Open **Inicio** tab.
3. **Expect**: Empty state copy + action to create first capsule.

### 2. Create capsule (FR-001–004, SC-001)

1. Tap create action → `lovebox/create`.
2. Enter title, body, future unlock date/time → save.
3. **Expect**: Success feedback; return to list; new row visible as **locked**.

### 3. Validation (FR-002–003)

1. Attempt save with empty title or body.
2. **Expect**: Save blocked with field errors; no new row.

### 4. Locked detail (FR-008)

1. Open a locked capsule.
2. **Expect**: Title visible; body hidden; unlock time hint shown.

### 5. Unlocked detail (FR-009–010)

1. Create capsule with unlock time in the past **or** wait until unlock time passes.
2. Open capsule.
3. **Expect**: Full body visible; list shows unlocked state.

### 6. Persistence (SC-002)

1. Create valid capsule.
2. Force-quit app; relaunch.
3. **Expect**: Capsule still in list with correct title and lock state.

## Quality gates

```bash
cd apps/mobile
npm run lint
npm run typecheck
```

Both must exit `0` before feature closure.

## Architecture spot-check

```text
apps/mobile/src/features/lovebox/domain/
apps/mobile/src/features/lovebox/data/
apps/mobile/src/features/lovebox/components/
apps/mobile/src/features/lovebox/containers/
apps/mobile/app/lovebox/
```

Confirm no `expo-sqlite` import under `lovebox/components/`.

## Troubleshooting

| Issue | Action |
|-------|--------|
| List always empty after create | Verify migration ran; check `databaseBootstrap === "ready"` |
| Detail shows body while locked | Verify `isCapsuleLocked` uses `unlockAt > now` |
| Date picker missing | Run `npx expo install @react-native-community/datetimepicker` |

## Done criteria

Map to spec SC-001–SC-005 and checklist in [spec.md](./spec.md). When all pass, run `/speckit-tasks` then `/speckit-implement`.
