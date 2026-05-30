import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/src/core/theme";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "app-theme-mode",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
