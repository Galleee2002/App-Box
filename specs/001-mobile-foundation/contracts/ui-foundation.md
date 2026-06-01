# Contract: Foundation UI

**Feature**: 001-mobile-foundation | **Type**: Shared presentation component

## Component: `FoundationScreen`

**Path**: `apps/mobile/src/presentation/ui/FoundationScreen.tsx`

### Props

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | yes |
| `description` | `string` | yes |

### Rendering rules

- Full-screen `View` with `bg-background` / `dark:bg-background-dark`
- Inner card: `rounded-lg`, `border-border-subtle`, `bg-surface`
- Title: `text-2xl font-bold text-text-primary`
- Description: `text-base text-text-secondary`

### Constraints

- MUST NOT import from `features/*`, `core/database`, or network clients
- MUST NOT contain business logic or local persistence

## Theme integration

Screens using NativeWind semantic classes MUST support dark mode via `dark:` variants OR parent `setColorScheme` from `useThemeStore`.

Settings screen MAY use `getThemeTokens` for native `Switch` colors.

## Extension point

Future design-system primitives (Button, Input) will live alongside `FoundationScreen` under `src/presentation/ui/`.
