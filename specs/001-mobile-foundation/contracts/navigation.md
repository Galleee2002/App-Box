# Contract: Foundation Navigation

**Feature**: 001-mobile-foundation | **Type**: In-app UI routing

## Root stack (`app/_layout.tsx`)

| Route name | Presentation | Header |
|------------|--------------|--------|
| `(tabs)` | Default | Hidden |
| `modal` | Modal | Title: “Info” |

**Initial route**: `(tabs)` via `unstable_settings.initialRouteName`.

## Tab navigator (`app/(tabs)/_layout.tsx`)

| Tab route | Title | Icon (Ionicons) |
|-----------|-------|-----------------|
| `index` | Inicio | `home` |
| `playground` | Playground | `hammer` |
| `settings` | Ajustes | `settings` |

## Screen content contract

Each tab route MUST render a `FoundationScreen` **except** `settings`, which MAY use custom layout for theme controls.

## Acceptance

- All registered tab routes resolve without 404.
- Tab bar uses theme tokens from `getThemeTokens(mode)`.
- Missing route files MUST NOT be registered in `_layout.tsx` (edge case from spec).
