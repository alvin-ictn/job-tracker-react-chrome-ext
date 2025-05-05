import { create } from "zustand";
import { persist } from "zustand/middleware";

type JobDraft = {
  [jobId: string]: Partial<any>; // Later you can replace 'any' with your Job type
};

interface JobDraftState {
  drafts: JobDraft;
  lastModified: Record<string, string>; // jobId → ISO string
  setDraft: (
    id: string,
    data: Partial<any>,
    options?: { replace?: boolean; move?: boolean; adjust?: boolean }
  ) => void;
  getAllDrafts: () => JobDraft;
  clearDraft: (id: string) => void;
  clearAll: () => void;
}

export const useJobDraftStore = create<JobDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      lastModified: {},

      setDraft: (id, data, options) =>
        set((state) => {
          return {
            drafts: {
              ...state.drafts,
              [id]: options?.replace
                ? { ...data } // Full replace mode
                : { ...(state.drafts[id] || {}), ...data }, // Merge mode
            },
            lastModified: {
              ...state.lastModified,
              [id]: new Date().toISOString(),
            },
          };
        }),

      getAllDrafts: () => get().drafts,

      clearDraft: (id) =>
        set((state) => {
          const { [id]: _, ...remainingDrafts } = state.drafts;
          const { [id]: __, ...remainingLastModified } = state.lastModified;
          return {
            drafts: remainingDrafts,
            lastModified: remainingLastModified,
          };
        }),

      clearAll: () => set({ drafts: {}, lastModified: {} }),
    }),
    {
      name: "job-drafts-storage",
    }
  )
);
