# Data Model: Lovebox Digital MVP

**Feature**: 002-lovebox-mvp | **Date**: 2026-06-01

## Capsule (domain entity)

Represents a single time-locked text message owned by the local device user.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (UUID v4) | Required; generated on create |
| `title` | string | Required; trimmed; max 120 chars (UI may truncate display) |
| `body` | string | Required; trimmed; max 10_000 chars |
| `unlockAt` | Date (instant) | Required; stored as ISO-8601 UTC in persistence |
| `createdAt` | Date (instant) | Required; set at insert; immutable |

### Derived (not persisted)

| Field | Type | Rules |
|-------|------|-------|
| `isLocked` | boolean | `true` when `unlockAt > now` (device clock) |

**Domain helper**:

```text
isCapsuleLocked(unlockAt: Date, now: Date = new Date()): boolean
  → unlockAt.getTime() > now.getTime()
```

Unlock at exact millisecond is treated as **unlocked** (`>` not `>=`).

## CapsuleList (read model)

| Field | Type | Rules |
|-------|------|-------|
| `items` | Capsule[] | Ordered per sort policy below |
| `isEmpty` | boolean | `items.length === 0` |

### List sort policy

1. **Locked** capsules: ascending by `unlockAt` (soonest unlock first).
2. **Unlocked** capsules: descending by `unlockAt` (most recently unlocked first).

## SQLite schema

**Database**: app SQLite file opened from `core/database` (same connection for future modules).

**Table**: `capsules`

| Column | SQL type | Constraints |
|--------|----------|-------------|
| `id` | TEXT | PRIMARY KEY |
| `title` | TEXT | NOT NULL |
| `body` | TEXT | NOT NULL |
| `unlock_at` | TEXT | NOT NULL — ISO-8601 UTC |
| `created_at` | TEXT | NOT NULL — ISO-8601 UTC |

**Migration file**: `apps/mobile/src/core/database/migrations/001_lovebox_capsules.sql`

```sql
CREATE TABLE IF NOT EXISTS capsules (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  unlock_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_capsules_unlock_at ON capsules (unlock_at);
```

## Validation matrix

| Rule | Layer | On failure |
|------|-------|------------|
| Title non-empty after trim | Domain + UI | Block save; inline error |
| Body non-empty after trim | Domain + UI | Block save; inline error |
| unlockAt provided | Domain + UI | Block save |
| unlockAt in past at save | Domain | Allow save; `isLocked === false` on read |
| Storage failure | Repository | Surface user-visible error; no partial row |

## State transitions

```text
[Create] → persisted row (unlockAt may be future or past)
     │
     ├─ unlockAt > now  → isLocked true  (list + detail: hidden body)
     │
     └─ unlockAt ≤ now  → isLocked false (full body visible)

[Time passes] → no DB update; isLocked flips on next read when now ≥ unlockAt
```

No edit/delete transitions in MVP.

## Relationships

```text
LocalDatabase (core)
  └── capsules table
        └── mapped to Capsule (domain) via capsuleMapper

CapsuleListContainer
  └── reads Capsule[] via CapsuleRepository.list()

CreateCapsuleContainer
  └── writes via CapsuleRepository.create()

CapsuleDetailContainer
  └── reads via CapsuleRepository.getById(id)
```

## Future extensions (not in 002)

- `recipient_id`, `author_id` for paired couple sync
- `unlock_type` enum (`temporal` | `geographic`)
- `media_uri` for attachments
- Supabase sync cursor / `updated_at` for conflict resolution
