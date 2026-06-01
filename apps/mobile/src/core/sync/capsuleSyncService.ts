import {
  fetchRemoteCapsules,
  pushCapsulesToRemote,
  type RemoteCapsuleDto,
} from "../api/capsuleRemoteApi";
import { getSyncConfig, isSyncEnabled } from "../config/sync";
import {
  getLatestSyncedUpdatedAt,
  listPendingCapsulesForSync,
  markCapsuleSynced,
  syncRowToCapsule,
  upsertCapsuleFromRemote,
} from "@/src/features/lovebox/data/capsuleLocalSync";

export type CapsuleSyncResult = {
  pushed: number;
  pulled: number;
  skipped: boolean;
};

function rowToRemoteDto(row: {
  id: string;
  title: string;
  body: string;
  unlock_at: string;
  created_at: string;
  updated_at: string;
}): RemoteCapsuleDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    unlockAt: row.unlock_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Offline-first sync: SQLite remains source of truth for UI.
 * Failures are silent so local UX never breaks (per product SPEC).
 */
export async function syncCapsulesWithNeon(): Promise<CapsuleSyncResult> {
  if (!isSyncEnabled()) {
    return { pushed: 0, pulled: 0, skipped: true };
  }

  const config = getSyncConfig();
  if (!config) {
    return { pushed: 0, pulled: 0, skipped: true };
  }

  let pushed = 0;
  let pulled = 0;

  try {
    const pending = await listPendingCapsulesForSync();
    if (pending.length > 0) {
      const payload = pending.map((row) => rowToRemoteDto(row));
      const accepted = await pushCapsulesToRemote(config, payload);
      for (const id of accepted) {
        await markCapsuleSynced(id);
        pushed += 1;
      }
    }

    const since = await getLatestSyncedUpdatedAt();
    const remote = await fetchRemoteCapsules(config, since);

    for (const dto of remote) {
      const capsule = syncRowToCapsule({
        id: dto.id,
        title: dto.title,
        body: dto.body,
        unlock_at: dto.unlockAt,
        created_at: dto.createdAt,
        sync_status: "synced",
        updated_at: dto.updatedAt,
      });
      await upsertCapsuleFromRemote(capsule, new Date(dto.updatedAt));
      pulled += 1;
    }
  } catch {
    return { pushed, pulled, skipped: false };
  }

  return { pushed, pulled, skipped: false };
}
