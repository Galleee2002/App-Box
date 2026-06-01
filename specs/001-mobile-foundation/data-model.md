# Data Model: Mobile Foundation Sprint

**Feature**: 001-mobile-foundation | **Date**: 2026-06-01

Foundation sprint uses **non-persistent conceptual entities** only. No SQLite tables are created in this feature.

## ScreenPlaceholder

Represents a baseline route used to validate rendering and navigation.

| Field | Type | Rules |
|-------|------|-------|
| `title` | string | Required, non-empty |
| `description` | string | Required, non-empty |

**Implementation**: Props on `FoundationScreen` in `apps/mobile/src/presentation/ui/FoundationScreen.tsx`.

**Instances**:
- Home (`app/(tabs)/index.tsx`)
- Playground (`app/(tabs)/playground.tsx`)
- Modal (`app/modal.tsx`)

## FoundationStructure

Represents required directory boundaries and ownership.

| Area | Path | Responsibility |
|------|------|----------------|
| Core | `src/core/theme`, `src/core/database` | Global theme + DB bootstrap |
| Features | `src/features/{lovebox,emotional-status,wishlist}/` | Future module slices |
| Presentation | `src/presentation/ui` | Shared pure UI |
| Navigation host | `app/` | Expo Router routes only |

## QualityGate

Represents automated baseline checks.

| Command | Expected outcome |
|---------|-------------------|
| `npm run lint` | Exit 0 |
| `npm run typecheck` | Exit 0 |

## ThemeMode (UI state)

| Field | Type | Rules |
|-------|------|-------|
| `mode` | `"light" \| "dark"` | Persisted in Zustand (`src/core/theme/store.ts`) |

## LocalDatabaseStatus (stub)

| Value | Meaning |
|-------|---------|
| `idle` | Foundation: no migrations run |
| `ready` | Reserved for feature specs after schema init |

**Implementation**: `apps/mobile/src/core/database/index.ts`

## Relationships

```text
FoundationStructure
  ├── hosts ScreenPlaceholder (via Expo Router routes)
  ├── configures ThemeMode (via core/theme)
  └── prepares LocalDatabaseStatus (stub only)
```

Business entities (Capsule, BucketItem, EmotionalState) are **out of scope**; defined in `docs/SPEC.md` for feature specs 002+.
