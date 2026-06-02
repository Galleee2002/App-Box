# Contract: Our Bucket Navigation

**Feature**: 003-our-bucket-mvp | **Type**: In-app UI routing (Expo Router)

## Root stack (`app/_layout.tsx`)

| Route name | Presentation | Change from 002 |
|------------|--------------|-------------------|
| `(tabs)` | Default | Unchanged |
| `lovebox` | Stack | Unchanged |
| `wishlist` | Stack (header shown on child routes) | **NEW** |
| `modal` | Modal | Unchanged |

## Tab: Planes (`app/(tabs)/playground.tsx`)

| Responsibility | Rule |
|----------------|------|
| Content | MUST render `BucketBoardContainer` (not `FoundationScreen`) |
| Header | Tab title remains **Planes** |
| Primary action | Visible control to navigate to `wishlist/create` |

## Wishlist stack (`app/wishlist/_layout.tsx`)

| Child route | Title (header) | Purpose |
|-------------|----------------|---------|
| `create` | Nuevo plan | Create bucket item |
| `[id]` | (dynamic: item title) | Detail + mark complete |

**Stack behavior**: `create` and `[id]` are pushed from board; back returns to Planes board.

## Deep linking (MVP)

| Path | Screen |
|------|--------|
| `/wishlist/create` | Create item |
| `/wishlist/:id` | Item detail |

File routes must exist even if universal linking is unused in MVP.

## Navigation acceptance

- From Planes, user reaches create screen and returns without losing board state (refresh on focus acceptable).
- From board card tap, user opens `/wishlist/[id]` with correct id.
- Invalid `id` shows not-found or empty error state (no crash).
- Completing an item on detail and navigating back shows updated status on board after focus refresh.
