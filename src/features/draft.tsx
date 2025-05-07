import { useEffect, useMemo, useState } from "react";
import { usePopupStore } from "../store/use-popup-store";
import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

const storageKey = "job_applications";
interface JobApplication {
  p_applied_date: string;
  p_company_name: string;
  job_title?: string;
  p_job_url: string;
  p_applied_from?: string;

  p_department?: string;
  p_employment_type?: string;
  p_from_extension?: boolean;
  p_job_location?: string;
  p_job_position?: string;
  p_location_type?: string;
}

export interface JobApplicationData {
  jobs: JobApplication[][];
}
export default function DraftJob() {
  const [jobss, setJobs] = useState([]);
  const { config } = usePopupStore();

  const filterDraftJobs = useMemo<JobApplication[]>(() => {
    return jobss.filter((job: { p_job_url: string }) => {
      return job.p_job_url.includes(config.menu);
    });
  }, [config.menu, jobss]);

  useEffect(() => {
    chrome?.storage?.local?.get?.([storageKey], (result) => {
      const savedJobs = result[storageKey] || [];
      setJobs(savedJobs);
    });

    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes[storageKey]) {
        const newValue = changes[storageKey].newValue || [];
        setJobs(newValue);
      }
    };

    chrome?.storage?.onChanged?.addListener(handleChange);

    return () => chrome?.storage?.onChanged?.removeListener(handleChange);
  }, []);

  return (
    <div>
      {filterDraftJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filterDraftJobs.map((job, index) => (
            <motion.div
            key={`${job.p_job_url}-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-md w-full max-w-sm mx-auto"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {job.p_job_position}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {job.p_company_name}
                </p>
              </div>
              <a
                href={job.p_job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View <ExternalLink size={14} />
              </a>
            </div>
          
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin size={14} /> {job.p_job_location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} /> Applied: {new Date(job.p_applied_date).toLocaleDateString()}
              </div>
            </div>
          
            <div className="flex justify-between mt-4 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                {job.p_employment_type}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                {job.p_location_type}
              </span>
            </div>
          </motion.div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
