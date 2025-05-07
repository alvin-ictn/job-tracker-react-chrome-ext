import { create } from "zustand";
import { supabase } from "../lib/supabase-client";
export interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  applied_date: string;
  p_job_url: string;
}

interface JobStore {
  jobs: JobApplication[];
  fetchJobs: () => Promise<void>;
  clearJobs: () => void;
  addJob: (job: Omit<JobApplication, "id">) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],

  fetchJobs: async () => {
    const { data, error } = await supabase
      .from("job_tracker_job_applications")
      .select("*")
      .order("applied_date", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error.message);
      return;
    }

    set({ jobs: data || [] });
  },

  clearJobs: () => set({ jobs: [] }),

  addJob: async (job) => {
    const { error } = await supabase
      .from("job_tracker_job_applications")
      .insert([job])
      .select("*");

    if (error) {
      console.error("Error adding job:", error.message);
      return;
    }

    // Re-fetch jobs to update list
    await get().fetchJobs();
  },
}));
