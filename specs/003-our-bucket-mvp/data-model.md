# Data Model: Our Bucket MVP

**Feature**: 003-our-bucket-mvp | **Date**: 2026-06-01

## BucketItem (domain entity)

Represents a single shared plan or goal on the local device.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (UUID v4) | Required; generated on create |
| `title` | string | Required; trimmed; max 120 chars |
| `description` | string | Required; trimmed; max 2000 chars |
| `category` | `BucketCategory` | Required; one of enum values below |
| `status` | `BucketItemStatus` | Required; `pending` on create |
| `createdAt` | Date (instant) | Required; set at insert; immutable |
| `completedAt` | Date \| null | Required null while pending; set on complete |

### BucketCategory (enum)

| Value | Display label (UI, Spanish) |
|-------|----------------------------|
| `trips` | Viajes |
| `dates` | Citas |
| `food` | Comida |
| `milestones` | Hitos |

### BucketItemStatus (enum)

| Value | Meaning |
|-------|---------|
| `pending` | Not yet marked done |
| `completed` | User marked complete; `completedAt` set |

**Domain helpers**:

```text
isBucketItemCompleted(item): boolean
  → item.status === "completed"

validateCreateBucketItemInput(input): ValidationResult
  → trim title/description; require non-empty; require category
```

## BucketBoard (read model)

| Field | Type | Rules |
|-------|------|-------|
| `items` | BucketItem[] | Ordered per sort policy below |
| `isEmpty` | boolean | `items.length === 0` |

### List sort policy

1. All **pending** items: descending by `createdAt` (newest plans first).
2. All **completed** items: descending by `completedAt` (most recently completed first).

Pending group always appears above completed group.

## SQLite schema

**Database**: same SQLite file as Lovebox (`lovebox.db` via `core/database`).

**Table**: `bucket_items`

| Column | SQL type | Constraints |
|--------|----------|-------------|
| `id` | TEXT | PRIMARY KEY |
| `title` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL — enum string |
| `status` | TEXT | NOT NULL — `pending` \| `completed` |
| `created_at` | TEXT | NOT NULL — ISO-8601 UTC |
| `completed_at` | TEXT | NULL until completed |

**Migration**: `MIGRATION_003` in `apps/mobile/src/core/database/index.ts`

```sql
CREATE TABLE IF NOT EXISTS bucket_items (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_bucket_items_status_created
  ON bucket_items (status, created_at);
CREATE INDEX IF NOT EXISTS idx_bucket_items_completed_at
  ON bucket_items (completed_at);
```

## Validation matrix

| Rule | Layer | On failure |
|------|-------|------------|
| Title non-empty after trim | Domain + UI | Block save; inline error |
| Description non-empty after trim | Domain + UI | Block save; inline error |
| Category selected | Domain + UI | Block save |
| Mark complete on missing id | Repository | Return null / not-found UX |
| Mark complete when already completed | Repository | No-op or return existing item (idempotent) |
| Storage failure | Repository | Surface user-visible error; no partial row |

## State transitions

```text
[Create] → row with status = pending, completed_at = NULL

[markCompleted]
     │
     ├─ pending  → status = completed, completed_at = now
     │
     └─ completed → no state change (idempotent read)
```

No edit/delete/revert transitions in MVP.

## Relationships

```text
LocalDatabase (core)
  └── bucket_items table
        └── mapped to BucketItem via bucketItemMapper

BucketBoardContainer
  └── reads BucketItem[] via BucketItemRepository.list()

CreateBucketItemContainer
  └── writes via BucketItemRepository.create()

BucketItemDetailContainer
  └── reads getById(); markCompleted() from board or detail
```

## Future extensions (not in 003)

- `cover_image_uri`, `memory_photo_uri`
- `confirmed_by_partner` workflow
- `archived_at` for memories section
- Supabase sync fields (`sync_status`, `updated_at`)
- Edit and delete operations
