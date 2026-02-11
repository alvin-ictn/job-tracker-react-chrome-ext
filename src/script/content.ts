import { addAppliedBadge } from "./applied-badge";
import extractLeverJobData from "./platform/lever";

const supabaseUrl = "https://lhgtqskqykkmpqhznjks.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ3Rxc2txeWtrbXBxaHpuamtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzg3NzYsImV4cCI6MjA1OTc1NDc3Nn0.FjYxr8gcCzGc8e8OI8m2NOv6M7o2KXdRQHXreNQ8ad8";

async function checkJobInSupabase(jobUrl: string) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/job_tracker_job_applications?p_job_url=ilike.*${encodeURIComponent(jobUrl)}*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (e) {
    return null;
  }
}

// Function to scrape current page based on URL
function scrapeJobDetails() {
  const url = window.location.href;
  let jobData = {
    title: "",
    company: "",
    location: "",
    url: url
  };

  if (url.includes("linkedin.com/jobs")) {
    jobData.title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.textContent?.trim() || "";
    jobData.company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.textContent?.trim() || "";
    jobData.location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.textContent?.trim() || "";
  } else if (url.includes("lever.co")) {
    // Use existing lever extractor if available or fallback
    const leverData = extractLeverJobData();
    jobData = {
      title: leverData.p_job_position || document.querySelector("h2")?.textContent?.trim() || "",
      company: leverData.p_company_name || document.title.split("-")[0].trim() || "",
      location: leverData.p_job_location || "",
      url: url
    }
  }

  return jobData;
}


// Listen for messages from Popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "get_job_details") {
    const data = scrapeJobDetails();
    sendResponse(data);
  }
});


const storageKey = "job_applications";

// Initial check on load
chrome.storage.local.get([storageKey], async (result) => {
  const existing = result[storageKey] || [];
  const currentUrl = window.location.href;

  const isDraft = existing.some((job: { p_job_url: string }) =>
    currentUrl.includes(job.p_job_url)
  );

  // Basic normalization for Lever/Greenhouse type URLs where ID is at end
  const pathnames = window.location.pathname.split('/');
  if (pathnames.length >= 4 && !window.location.hostname.includes("linkedin")) {
    // logic that was there before, keeping it safe
    // pathnames.pop() 
  }

  // Construct a clean URL for searching (naive approach for now)
  const cleanUrl = window.location.href.split('?')[0];

  const isSaved = await checkJobInSupabase(cleanUrl);

  let message = "";

  if (isDraft) {
    message = "Saved in Draft";
  } else if (isSaved) {
    message = "Tracked";
  }

  if (message) {
    addAppliedBadge(message);
  }
});
