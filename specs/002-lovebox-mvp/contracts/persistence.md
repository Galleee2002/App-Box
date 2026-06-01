# Contract: Lovebox Persistence

**Feature**: 002-lovebox-mvp | **Type**: Repository (feature data layer)

## Interface: `CapsuleRepository`

**Path**: `apps/mobile/src/features/lovebox/domain/capsuleRepository.ts`

```typescript
export interface CapsuleRepository {
  list(): Promise<Capsule[]>;
  getById(id: string): Promise<Capsule | null>;
  create(input: CreateCapsuleInput): Promise<Capsule>;
}

export type CreateCapsuleInput = {
  title: string;
  body: string;
  unlockAt: Date;
};
```

## Implementation: `sqliteCapsuleRepository`

**Path**: `apps/mobile/src/features/lovebox/data/sqliteCapsuleRepository.ts`

| Method | Behavior |
|--------|----------|
| `list()` | Returns all rows mapped to domain; order per [data-model.md](../data-model.md) sort policy |
| `getById(id)` | Returns `null` if missing |
| `create(input)` | Validates via domain; generates `id` + `createdAt`; INSERT; returns entity |

## Mapper: `capsuleMapper`

| Direction | Responsibility |
|-----------|----------------|
| Row → `Capsule` | Parse ISO dates; never expose SQL row types to UI |
| `Capsule` → Row | Serialize dates to UTC ISO strings |

## Database bootstrap

**Path**: `apps/mobile/src/core/database/`

| Requirement | Rule |
|-------------|------|
| Migration | Run `001_lovebox_capsules.sql` before first repository call |
| Status | Set `databaseBootstrap` to `"ready"` after successful migration |
| Failure | Lovebox screens show non-blocking error with retry (no silent fail) |

## Constraints

- Only `data/sqliteCapsuleRepository.ts` and `core/database/*` may import `expo-sqlite` for capsule operations.
- No `update` or `delete` methods in MVP interface.
- No network calls in repository.

## Acceptance

- `create` + app restart + `list` returns same capsule (SC-002).
- `getById` for locked capsule: container can compute `isLocked` and hide body.
- Whitespace-only title/body rejected before INSERT.
