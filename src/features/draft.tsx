import { useEffect, useMemo, useState } from "react";
import { usePopupStore } from "../store/use-popup-store";

const storageKey = "job_applications";
interface JobApplication {
  applied_date: string;
  company_name: string;
  job_title?: string;
  job_url: string;
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
    return jobss.filter((job: { job_url: string }) => {
      return job.job_url.includes(config.menu);
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

    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  return (
    <div>
      {filterDraftJobs.length > 0 ? (
        <ul className="list-disc pl-4 space-y-1">
          {filterDraftJobs.map((job, index) => (
            <li key={`${job.job_url}-${index}`}>
              <strong>{job.job_title}</strong> at {job.company_name}
              <br />
              <a
                href={job.job_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Job
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
