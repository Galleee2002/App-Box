# Contract: Lovebox Navigation

**Feature**: 002-lovebox-mvp | **Type**: In-app UI routing (Expo Router)

## Root stack (`app/_layout.tsx`)

| Route name | Presentation | Change from foundation |
|------------|--------------|------------------------|
| `(tabs)` | Default | Unchanged |
| `lovebox` | Stack (header shown on child routes) | **NEW** |
| `modal` | Modal | Unchanged |

## Tab: Inicio (`app/(tabs)/index.tsx`)

| Responsibility | Rule |
|----------------|------|
| Content | MUST render `CapsuleListContainer` (not `FoundationScreen`) |
| Header | Tab title remains **Inicio** (or product rename to **Lovebox** in tasks — default **Inicio**) |
| Primary action | Visible control to navigate to `lovebox/create` |

## Lovebox stack (`app/lovebox/_layout.tsx`)

| Child route | Title (header) | Purpose |
|-------------|----------------|---------|
| `create` | Nueva cápsula | Create flow |
| `[id]` | (dynamic: capsule title) | Detail locked/unlocked |

**Stack behavior**: `create` and `[id]` are pushed from list; back returns to Inicio list.

## Deep linking (MVP)

| Path | Screen |
|------|--------|
| `/lovebox/create` | Create capsule |
| `/lovebox/:id` | Capsule detail |

Optional for MVP; file routes must exist even if linking unused.

## Navigation acceptance

- From Inicio, user reaches create screen and returns without losing list state (refresh on focus acceptable).
- From list item tap, user opens `/lovebox/[id]` with correct id.
- Invalid `id` shows not-found or empty error state (no crash).
