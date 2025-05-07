import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DraftJob {
  p_job_url: string;
  platform: "linkedin" | "lever" | "other";
  company: string;
  position: string;
}

interface DraftJobsState {
  jobs: DraftJob[];
  addJob: (job: DraftJob) => void;
  removeJob: (p_job_url: string) => void;
  clearJobs: () => void;
}

export const useDraftJobsStore = create<DraftJobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      addJob: (job) => {
        if (!get().jobs.some((j) => j.p_job_url === job.p_job_url)) {
          set((state) => ({ jobs: [...state.jobs, job] }));
        }
      },
      removeJob: (p_job_url) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.p_job_url !== p_job_url),
        }));
      },
      clearJobs: () => set({ jobs: [] }),
    }),
    {
      name: "jobtracker-draft-jobs",
    }
  )
);
