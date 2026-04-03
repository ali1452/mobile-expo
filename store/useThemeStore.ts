import { create } from "zustand";

type ThemeStore = {
  isDark: boolean;
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
}));
