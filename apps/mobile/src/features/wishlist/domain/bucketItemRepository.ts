import type { BucketCategory, BucketItem } from "./bucketItem";

export type CreateBucketItemInput = {
  title: string;
  description: string;
  category: BucketCategory;
};

export interface BucketItemRepository {
  list(): Promise<BucketItem[]>;
  getById(id: string): Promise<BucketItem | null>;
  create(input: CreateBucketItemInput): Promise<BucketItem>;
  markCompleted(id: string): Promise<BucketItem | null>;
}
