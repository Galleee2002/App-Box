import { getDatabase } from "@/src/core/database";
import { generateId } from "@/src/core/generateId";
import { sortBucketItems, validateCreateBucketItemInput } from "../domain/bucketItem";
import type { BucketItem } from "../domain/bucketItem";
import type { BucketItemRepository, CreateBucketItemInput } from "../domain/bucketItemRepository";
import { bucketItemToRow, rowToBucketItem, type BucketItemRow } from "./bucketItemMapper";

export function createSqliteBucketItemRepository(): BucketItemRepository {
  return {
    async list(): Promise<BucketItem[]> {
      const db = getDatabase();
      const rows = await db.getAllAsync<BucketItemRow>(
        "SELECT id, title, description, category, status, created_at, completed_at FROM bucket_items",
      );
      const items = rows.map(rowToBucketItem);
      return sortBucketItems(items);
    },

    async getById(id: string): Promise<BucketItem | null> {
      const db = getDatabase();
      const row = await db.getFirstAsync<BucketItemRow>(
        "SELECT id, title, description, category, status, created_at, completed_at FROM bucket_items WHERE id = ?",
        [id],
      );
      return row ? rowToBucketItem(row) : null;
    },

    async create(input: CreateBucketItemInput): Promise<BucketItem> {
      const validation = validateCreateBucketItemInput({
        title: input.title,
        description: input.description,
        category: input.category,
      });

      if (!validation.ok) {
        const message = Object.values(validation.errors).filter(Boolean).join(" ");
        throw new Error(message || "Datos del plan no válidos.");
      }

      const now = new Date();
      const item: BucketItem = {
        id: generateId(),
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        status: "pending",
        createdAt: now,
        completedAt: null,
      };

      const row = bucketItemToRow(item);
      const db = getDatabase();

      try {
        await db.runAsync(
          `INSERT INTO bucket_items (id, title, description, category, status, created_at, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [row.id, row.title, row.description, row.category, row.status, row.created_at, row.completed_at],
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo guardar el plan.";
        throw new Error(message);
      }

      return item;
    },

    async markCompleted(id: string): Promise<BucketItem | null> {
      const existing = await this.getById(id);
      if (!existing) {
        return null;
      }

      if (existing.status === "completed") {
        return existing;
      }

      const completedAt = new Date();
      const updated: BucketItem = {
        ...existing,
        status: "completed",
        completedAt,
      };

      const row = bucketItemToRow(updated);
      const db = getDatabase();

      try {
        await db.runAsync(
          "UPDATE bucket_items SET status = ?, completed_at = ? WHERE id = ?",
          [row.status, row.completed_at, row.id],
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo marcar el plan como completado.";
        throw new Error(message);
      }

      return updated;
    },
  };
}

export const sqliteBucketItemRepository = createSqliteBucketItemRepository();
