import { useDraftJobsStore } from "../store/use-draft-job-store";

export function useDraftJobs() {
  const jobs = useDraftJobsStore((state) => state.jobs);
  const addJob = useDraftJobsStore((state) => state.addJob);
  const removeJob = useDraftJobsStore((state) => state.removeJob);
  const clearJobs = useDraftJobsStore((state) => state.clearJobs);

  return {
    jobs,
    addJob,
    removeJob,
    clearJobs,
  };
}
