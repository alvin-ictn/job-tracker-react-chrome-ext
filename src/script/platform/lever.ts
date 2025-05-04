function parseJobPostingLever(element: HTMLElement) {
  const job_position = element.children?.[0]?.innerHTML;
  const location = element.querySelector("[class*='location']")?.innerHTML?.trim() || null;
  const department = element.querySelector("[class*='department']")?.innerHTML?.trim() || null;
  const location_type =  element.querySelector("[class*='workplaceTypes']")?.innerHTML?.trim() || null;
  const employment_type = element.querySelector("[class*='commitment']")?.innerHTML?.trim() || null;
  
  return {
    job_position,
    department,
    employment_type,
    location_type,
    location,
  };
}

export default function extractLeverJobData() {
  const postingHead =
    (document.querySelector("[class*='posting-head']") as HTMLElement);
  const { job_position, department, employment_type, location_type, location } =
    parseJobPostingLever(postingHead);

  const company = window.location.pathname?.split?.("/")?.[1] ||
    document.querySelector(".company-name")?.textContent ||
    window.location.hostname;

  const jobUrl = window.location.href.replace("/apply","");

  return {
    company_name: company.trim(),
    p_job_position: job_position?.trim(),
    p_department: department?.trim(),
    p_employment_type: employment_type?.trim(),
    p_location_type: location_type?.trim(),
    p_job_location: location?.trim(),
    applied_date: new Date().toISOString(),
    job_url: jobUrl,
    p_from_extension: true,
  };
}
