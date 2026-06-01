import type { Capsule } from "../domain/capsule";

export type CapsuleRow = {
  id: string;
  title: string;
  body: string;
  unlock_at: string;
  created_at: string;
  sync_status?: string;
  updated_at?: string;
};

export type CapsuleSyncRow = CapsuleRow & {
  sync_status: string;
  updated_at: string;
};

export function rowToCapsule(row: CapsuleRow): Capsule {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    unlockAt: new Date(row.unlock_at),
    createdAt: new Date(row.created_at),
  };
}

export function capsuleToRow(capsule: Capsule): CapsuleRow {
  return {
    id: capsule.id,
    title: capsule.title,
    body: capsule.body,
    unlock_at: capsule.unlockAt.toISOString(),
    created_at: capsule.createdAt.toISOString(),
  };
}

export function createInputToRow(input: {
  id: string;
  title: string;
  body: string;
  unlockAt: Date;
  createdAt: Date;
}): CapsuleRow {
  return {
    id: input.id,
    title: input.title.trim(),
    body: input.body.trim(),
    unlock_at: input.unlockAt.toISOString(),
    created_at: input.createdAt.toISOString(),
  };
}
