import { getDatabase } from "@/src/core/database";
import type { Capsule } from "../domain/capsule";
import { rowToCapsule, type CapsuleSyncRow } from "./capsuleMapper";

const SYNC_COLUMNS =
  "id, title, body, unlock_at, created_at, sync_status, updated_at";

export async function listPendingCapsulesForSync(): Promise<CapsuleSyncRow[]> {
  const db = getDatabase();
  return db.getAllAsync<CapsuleSyncRow>(
    `SELECT ${SYNC_COLUMNS} FROM capsules WHERE sync_status = 'pending'`,
  );
}

export async function markCapsuleSynced(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync("UPDATE capsules SET sync_status = 'synced' WHERE id = ?", [id]);
}

export async function getCapsuleSyncMeta(
  id: string,
): Promise<{ updatedAt: string; syncStatus: string } | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<{ updated_at: string; sync_status: string }>(
    "SELECT updated_at, sync_status FROM capsules WHERE id = ?",
    [id],
  );
  if (!row?.updated_at) {
    return null;
  }
  return { updatedAt: row.updated_at, syncStatus: row.sync_status };
}

export async function upsertCapsuleFromRemote(capsule: Capsule, updatedAt: Date): Promise<void> {
  const db = getDatabase();
  const updatedIso = updatedAt.toISOString();
  const unlockIso = capsule.unlockAt.toISOString();
  const createdIso = capsule.createdAt.toISOString();

  const existing = await getCapsuleSyncMeta(capsule.id);

  if (!existing) {
    await db.runAsync(
      `INSERT INTO capsules (id, title, body, unlock_at, created_at, sync_status, updated_at)
       VALUES (?, ?, ?, ?, ?, 'synced', ?)`,
      [capsule.id, capsule.title, capsule.body, unlockIso, createdIso, updatedIso],
    );
    return;
  }

  if (existing.updatedAt >= updatedIso) {
    return;
  }

  await db.runAsync(
    `UPDATE capsules
     SET title = ?, body = ?, unlock_at = ?, created_at = ?, sync_status = 'synced', updated_at = ?
     WHERE id = ?`,
    [capsule.title, capsule.body, unlockIso, createdIso, updatedIso, capsule.id],
  );
}

/** Cursor for pull: only synced rows so pending local writes do not hide remote updates. */
export async function getLatestSyncedUpdatedAt(): Promise<string | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<{ updated_at: string }>(
    `SELECT updated_at FROM capsules
     WHERE sync_status = 'synced' AND updated_at IS NOT NULL
     ORDER BY updated_at DESC LIMIT 1`,
  );
  return row?.updated_at ?? null;
}

export function syncRowToCapsule(row: CapsuleSyncRow): Capsule {
  return rowToCapsule(row);
}
