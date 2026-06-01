import { create } from "zustand";
import { syncCapsulesWithNeon } from "@/src/core/sync/capsuleSyncService";
import type { Capsule } from "../domain/capsule";
import { sqliteCapsuleRepository } from "../data/sqliteCapsuleRepository";

type CapsuleStoreState = {
  items: Capsule[];
  loading: boolean;
  error: string | null;
  loadCapsules: () => Promise<void>;
  setItems: (items: Capsule[]) => void;
  clearError: () => void;
};

export const useCapsuleStore = create<CapsuleStoreState>((set) => ({
  items: [],
  loading: false,
  error: null,

  setItems: (items) => set({ items }),

  clearError: () => set({ error: null }),

  loadCapsules: async () => {
    set({ loading: true, error: null });
    try {
      await syncCapsulesWithNeon();
      const items = await sqliteCapsuleRepository.list();
      set({ items, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron cargar las cápsulas.";
      set({ loading: false, error: message });
    }
  },
}));
