import { getDatabase } from "@/src/core/database";
import { sortCapsules, validateCreateCapsuleInput } from "../domain/capsule";
import type { Capsule } from "../domain/capsule";
import type { CapsuleRepository, CreateCapsuleInput } from "../domain/capsuleRepository";
import { createInputToRow, rowToCapsule, type CapsuleRow } from "./capsuleMapper";

function generateId(): string {
  return globalThis.crypto.randomUUID();
}

export function createSqliteCapsuleRepository(): CapsuleRepository {
  return {
    async list(): Promise<Capsule[]> {
      const db = getDatabase();
      const rows = await db.getAllAsync<CapsuleRow>(
        "SELECT id, title, body, unlock_at, created_at, sync_status, updated_at FROM capsules",
      );
      const capsules = rows.map(rowToCapsule);
      return sortCapsules(capsules);
    },

    async getById(id: string): Promise<Capsule | null> {
      const db = getDatabase();
      const row = await db.getFirstAsync<CapsuleRow>(
        "SELECT id, title, body, unlock_at, created_at, sync_status, updated_at FROM capsules WHERE id = ?",
        [id],
      );
      return row ? rowToCapsule(row) : null;
    },

    async create(input: CreateCapsuleInput): Promise<Capsule> {
      const validation = validateCreateCapsuleInput({
        title: input.title,
        body: input.body,
        unlockAt: input.unlockAt,
      });

      if (!validation.ok) {
        const message = Object.values(validation.errors).filter(Boolean).join(" ");
        throw new Error(message || "Datos de cápsula no válidos.");
      }

      const now = new Date();
      const capsule: Capsule = {
        id: generateId(),
        title: input.title.trim(),
        body: input.body.trim(),
        unlockAt: input.unlockAt,
        createdAt: now,
      };

      const row = createInputToRow(capsule);
      const updatedAt = now.toISOString();
      const db = getDatabase();

      try {
        await db.runAsync(
          `INSERT INTO capsules (id, title, body, unlock_at, created_at, sync_status, updated_at)
           VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
          [row.id, row.title, row.body, row.unlock_at, row.created_at, updatedAt],
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo guardar la cápsula.";
        throw new Error(message);
      }

      return capsule;
    },
  };
}

export const sqliteCapsuleRepository = createSqliteCapsuleRepository();
