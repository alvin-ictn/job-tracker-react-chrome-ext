function parseJobPostingLever(text: string) {
  const lines = text.trim().split("\n");
  const job_position = lines[0].trim();

  // Extract parts from the second line
  const secondLine = lines[1] || "";
  const [locationAndDept, ...rest] = secondLine.split("/");
  const [locationRaw, departmentRaw] = locationAndDept.split(/(?=[A-Z])/); // split before capital letter

  const location = locationRaw?.trim() || null;

  // department may include dashes or spaces
  const department = departmentRaw
    ? departmentRaw.replace(/–|-/g, "").trim()
    : null;

  const employment_type = rest[0]?.trim() || null;
  const location_type = rest[1]?.trim() || null;

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
    (document.querySelector("[class*='posting-head']") as HTMLElement)
      ?.innerText ||
    document.querySelector("h2")?.textContent ||
    document.querySelector(".posting-headline h2")?.textContent ||
    "Unknown Title";

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
