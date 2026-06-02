# Contract: Our Bucket Persistence

**Feature**: 003-our-bucket-mvp | **Type**: Repository (feature data layer)

## Interface: `BucketItemRepository`

**Path**: `apps/mobile/src/features/wishlist/domain/bucketItemRepository.ts`

```typescript
export interface BucketItemRepository {
  list(): Promise<BucketItem[]>;
  getById(id: string): Promise<BucketItem | null>;
  create(input: CreateBucketItemInput): Promise<BucketItem>;
  markCompleted(id: string): Promise<BucketItem | null>;
}

export type CreateBucketItemInput = {
  title: string;
  description: string;
  category: BucketCategory;
};
```

## Implementation: `sqliteBucketItemRepository`

**Path**: `apps/mobile/src/features/wishlist/data/sqliteBucketItemRepository.ts`

| Method | Behavior |
|--------|----------|
| `list()` | Returns all rows mapped to domain; order per [data-model.md](../data-model.md) sort policy |
| `getById(id)` | Returns `null` if missing |
| `create(input)` | Validates via domain; generates `id`, `createdAt`, `status: pending`; INSERT; returns entity |
| `markCompleted(id)` | If missing → `null`; if already completed → return item unchanged; else UPDATE `status`, `completed_at` |

## Mapper: `bucketItemMapper`

| Direction | Responsibility |
|-----------|----------------|
| Row → `BucketItem` | Parse ISO dates; map category string to enum; never expose SQL row types to UI |
| Domain → Row | Serialize dates to UTC ISO strings |

## Database bootstrap

**Path**: `apps/mobile/src/core/database/index.ts`

| Requirement | Rule |
|-------------|------|
| Migration | Run `MIGRATION_003` (bucket_items) after existing migrations |
| Status | `initializeDatabase()` already sets bootstrap to `"ready"` when all migrations succeed |
| Failure | Wishlist screens show non-blocking error with retry (no silent fail) |

## Constraints

- Only `data/sqliteBucketItemRepository.ts` and `core/database/*` may import `expo-sqlite` for bucket operations.
- No `update` (edit), `delete`, or `revertComplete` in MVP interface.
- No network calls in repository.

## Acceptance

- `create` + app restart + `list` returns same item (SC-002).
- `markCompleted` persists `completed_at` visible on detail and board (SC-003).
- Whitespace-only title/description rejected before INSERT.
