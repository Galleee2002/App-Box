import type { BucketCategory, BucketItem, BucketItemStatus } from "../domain/bucketItem";

export type BucketItemRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  completed_at: string | null;
};

const BUCKET_CATEGORIES: BucketCategory[] = ["trips", "dates", "food", "milestones"];

function parseCategory(value: string): BucketCategory {
  if (BUCKET_CATEGORIES.includes(value as BucketCategory)) {
    return value as BucketCategory;
  }
  return "milestones";
}

function parseStatus(value: string): BucketItemStatus {
  return value === "completed" ? "completed" : "pending";
}

export function rowToBucketItem(row: BucketItemRow): BucketItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: parseCategory(row.category),
    status: parseStatus(row.status),
    createdAt: new Date(row.created_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : null,
  };
}

export function bucketItemToRow(item: BucketItem): BucketItemRow {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    created_at: item.createdAt.toISOString(),
    completed_at: item.completedAt ? item.completedAt.toISOString() : null,
  };
}
