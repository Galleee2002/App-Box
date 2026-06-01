# Contract: Lovebox UI Components

**Feature**: 002-lovebox-mvp | **Type**: Feature + shared presentation

## Shared primitives (`src/presentation/ui/`)

May be introduced in this feature if not already present:

### `Button`

| Prop | Type | Required |
|------|------|----------|
| `label` | string | yes |
| `onPress` | () => void | yes |
| `disabled` | boolean | no |
| `variant` | `"primary" \| "secondary"` | no |

MUST NOT access persistence.

### `TextField`

| Prop | Type | Required |
|------|------|----------|
| `label` | string | yes |
| `value` | string | yes |
| `onChangeText` | (text: string) => void | yes |
| `error` | string | no |
| `multiline` | boolean | no |

## Feature components (`src/features/lovebox/components/`)

### `CapsuleEmptyState`

| Prop | Type | Required |
|------|------|----------|
| `onCreatePress` | () => void | yes |

MUST explain what a capsule is and invite first create (FR-006).

### `CapsuleListItem`

| Prop | Type | Required |
|------|------|----------|
| `title` | string | yes |
| `isLocked` | boolean | yes |
| `unlockAt` | Date | yes |
| `onPress` | () => void | yes |

MUST show locked/unlocked indicator and title; MUST NOT show full `body`.

### `LockedCapsuleDetail`

| Prop | Type | Required |
|------|------|----------|
| `title` | string | yes |
| `unlockAt` | Date | yes |

MUST NOT receive or render `body`. MUST show unlock hint (formatted date/time or countdown).

### `UnlockedCapsuleDetail`

| Prop | Type | Required |
|------|------|----------|
| `title` | string | yes |
| `body` | string | yes |

MUST render full message body (FR-009).

## Container contracts

| Container | Data source | Renders |
|-----------|-------------|---------|
| `CapsuleListContainer` | Repository `list()` + store | Empty state OR list of `CapsuleListItem` |
| `CreateCapsuleContainer` | Form state → `create()` | Form fields + save |
| `CapsuleDetailContainer` | Repository `getById()` | `LockedCapsuleDetail` OR `UnlockedCapsuleDetail` |

Containers MAY import repository and store. Components MUST NOT.

## Theme

All Lovebox screens MUST use semantic tokens (`bg-background`, `text-text-primary`, `bg-surface`, `text-accent`) and support dark mode via existing `useThemeStore` / NativeWind `dark:` variants.

## Accessibility (MVP baseline)

- Tappable targets ≥ 44pt height for list rows and primary buttons
- `accessibilityLabel` on locked/unlocked badges for VoiceOver
