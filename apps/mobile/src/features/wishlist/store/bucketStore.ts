import { create } from "zustand";
import type { BucketItem } from "../domain/bucketItem";
import { sqliteBucketItemRepository } from "../data/sqliteBucketItemRepository";

type BucketStoreState = {
  items: BucketItem[];
  loading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  setItems: (items: BucketItem[]) => void;
  clearError: () => void;
};

export const useBucketStore = create<BucketStoreState>((set) => ({
  items: [],
  loading: false,
  error: null,

  setItems: (items) => set({ items }),

  clearError: () => set({ error: null }),

  loadItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await sqliteBucketItemRepository.list();
      set({ items, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron cargar los planes.";
      set({ loading: false, error: message });
    }
  },
}));
