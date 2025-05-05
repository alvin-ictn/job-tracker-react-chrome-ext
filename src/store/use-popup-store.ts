import { create } from "zustand";

export interface PopupConfig {
  menu: string;
  title: string;
}

interface PopupStore {
  config: PopupConfig;
  setConfig: (config: Partial<PopupConfig>) => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  config: {
    menu: "jobtracker",
    title: "Saved - JobTracker"
  },
  setConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },
}));
