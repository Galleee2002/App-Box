# Quickstart: Our Bucket MVP

**Feature**: 003-our-bucket-mvp | **Target**: iOS simulator

**Prerequisites**: Foundation complete ([001 quickstart](../001-mobile-foundation/quickstart.md)); Lovebox MVP validated ([002 quickstart](../002-lovebox-mvp/quickstart.md)).

## Install (if needed)

```bash
cd apps/mobile
npm install
```

No new Expo packages required for MVP (reuses existing UI primitives).

## Run

```bash
npm run ios
```

From monorepo root: `npm run ios`.

## Manual acceptance flow

### 1. Empty state (FR-006, SC-005)

1. Fresh install or delete app from simulator (or clear data if dev tooling available).
2. Open **Planes** tab.
3. **Expect**: Empty state copy + action to add first plan.

### 2. Create item (FR-001–004, SC-001)

1. Tap create action → `wishlist/create`.
2. Enter title, description, select a category → save.
3. **Expect**: Success feedback; return to board; new card visible as **pending**.

### 3. Validation (FR-002–003)

1. Attempt save with empty title or description, or without category.
2. **Expect**: Save blocked with field errors; no new row.

### 4. Board list (FR-005–007, SC-004)

1. With multiple items (mix pending and completed if possible).
2. **Expect**: Each card shows title, category, pending/completed indicator; pending group above completed.

### 5. Mark complete (FR-008–010, SC-003)

1. Open a pending item from the board.
2. Tap mark complete.
3. **Expect**: Celebration overlay; item shows completed with completion date on detail and board after return.

### 6. Persistence (SC-002)

1. Create a valid item.
2. Force-quit app; relaunch.
3. **Expect**: Item still on board with same title, category, and status.

## Quality gates

```bash
cd apps/mobile
npm run lint
npm run typecheck
```

Both must exit `0` before feature closure.

## Architecture spot-check

```text
apps/mobile/src/features/wishlist/domain/
apps/mobile/src/features/wishlist/data/
apps/mobile/src/features/wishlist/components/
apps/mobile/src/features/wishlist/containers/
apps/mobile/app/wishlist/
```

Confirm no `expo-sqlite` import under `wishlist/components/`.

## Troubleshooting

| Issue | Action |
|-------|--------|
| Board always empty after create | Verify `MIGRATION_003` ran; check `getDatabaseBootstrapStatus() === "ready"` |
| Complete does not stick | Verify `markCompleted` UPDATE and board refresh on focus |
| Categories not selectable | Check `CategoryPicker` passes valid enum to `create()` |

## Done criteria

Map to spec SC-001–SC-005 and checklist in [spec.md](./spec.md). When all pass, run `/speckit-tasks` then `/speckit-implement`.
