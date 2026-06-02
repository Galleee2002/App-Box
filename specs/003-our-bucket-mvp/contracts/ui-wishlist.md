# Contract: Our Bucket UI Components

**Feature**: 003-our-bucket-mvp | **Type**: Feature + shared presentation

## Shared primitives (`src/presentation/ui/`)

**Reuse** from Lovebox / foundation (do not duplicate):

- `Button` — primary/secondary actions
- `TextField` — title and multiline description
- `SuccessFeedbackOverlay` — create success and completion celebration (FR-010)

Shared primitives MUST NOT access persistence.

## Feature components (`src/features/wishlist/components/`)

### `BucketEmptyState`

| Prop | Type | Required |
|------|------|----------|
| `onCreatePress` | () => void | yes |

MUST explain what the board is for and invite first create (FR-006).

### `BucketListItem`

| Prop | Type | Required |
|------|------|----------|
| `title` | string | yes |
| `categoryLabel` | string | yes |
| `isCompleted` | boolean | yes |
| `completedAt` | Date \| null | no |
| `onPress` | () => void | yes |

MUST show title, category, and pending/completed indicator; MUST NOT require cover image.

### `BucketItemDetail`

| Prop | Type | Required |
|------|------|----------|
| `title` | string | yes |
| `description` | string | yes |
| `categoryLabel` | string | yes |
| `isCompleted` | boolean | yes |
| `completedAt` | Date \| null | no |
| `onMarkComplete` | () => void | yes (ignored when `isCompleted`) |

MUST show full description. MUST show human-readable completion date when completed. MUST expose complete action when pending.

### `CategoryPicker` (optional sub-component)

| Prop | Type | Required |
|------|------|----------|
| `value` | BucketCategory \| null | yes |
| `onChange` | (category: BucketCategory) => void | yes |

MUST offer exactly four categories with Spanish labels per data-model.

## Container contracts

| Container | Data source | Renders |
|-----------|-------------|---------|
| `BucketBoardContainer` | Repository `list()` + store | Empty state OR list of `BucketListItem`; optional inline complete from list (detail path sufficient for MVP) |
| `CreateBucketItemContainer` | Form state → `create()` | Form + category picker + save + success overlay |
| `BucketItemDetailContainer` | `getById()` + `markCompleted()` | `BucketItemDetail` + completion overlay |

Containers MAY import repository and store. Components MUST NOT.

## Theme

All Our Bucket screens MUST use semantic tokens (`bg-background`, `text-text-primary`, `bg-surface`, `text-accent`) and support dark mode via `useThemeStore` / NativeWind `dark:` variants.

## Accessibility (MVP baseline)

- Tappable targets ≥ 44pt for board cards and primary buttons
- `accessibilityLabel` on pending/completed badges for VoiceOver
- Category chips must be individually focusable with labels (Viajes, Citas, etc.)
