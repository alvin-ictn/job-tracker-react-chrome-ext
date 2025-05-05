import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DraftJob {
  job_url: string;
  platform: "linkedin" | "lever" | "other";
  company: string;
  position: string;
}

interface DraftJobsState {
  jobs: DraftJob[];
  addJob: (job: DraftJob) => void;
  removeJob: (job_url: string) => void;
  clearJobs: () => void;
}

export const useDraftJobsStore = create<DraftJobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      addJob: (job) => {
        if (!get().jobs.some((j) => j.job_url === job.job_url)) {
          set((state) => ({ jobs: [...state.jobs, job] }));
        }
      },
      removeJob: (job_url) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.job_url !== job_url),
        }));
      },
      clearJobs: () => set({ jobs: [] }),
    }),
    {
      name: "jobtracker-draft-jobs",
    }
  )
);
