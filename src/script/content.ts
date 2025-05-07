import { addAppliedBadge } from "./applied-badge";
import extractLeverJobData from "./platform/lever";

const supabaseUrl = "https://lhgtqskqykkmpqhznjks.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ3Rxc2txeWtrbXBxaHpuamtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzg3NzYsImV4cCI6MjA1OTc1NDc3Nn0.FjYxr8gcCzGc8e8OI8m2NOv6M7o2KXdRQHXreNQ8ad8";

async function checkJobInSupabase(jobUrl: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/job_tracker_job_applications?p_job_url=ilike.*${encodeURIComponent(jobUrl)}*`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    console.error("Supabase fetch failed", res.status);
    return null;
  }

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

const storageKey = "job_applications";

// async function checkJobInSupabase(jobUrl: string) {
//   const { data, error } = await supabase
//     .from("job_tracker_job_applications")
//     .select("*")
//     .ilike("p_job_url", `%${jobUrl}%`)
//     .single();

//   if (error || !data) return null;
//   return data;
// }
chrome.storage.local.get([storageKey], async(result) => {
  const existing = result[storageKey] || [];
  const currentUrl = window.location.href;

  const isDraft = existing.some((job: { p_job_url: string }) =>
    currentUrl.includes(job.p_job_url)
  );

  const pathnames = window.location.pathname.split('/')

  if(pathnames.length === 4) pathnames.pop()

  const isSaved = await checkJobInSupabase(`${window.location.origin}${pathnames.join("/")}`);

  let message = "";

  if (isDraft) {
    message = "Saved\nby JobTracker";
  } else if (isSaved) {
    message = "Tracked\nby JobTracker";
  }

  if(message) {
      addAppliedBadge(message);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (
    target &&
    target.textContent?.toLowerCase().includes("submit application")
  ) {
    const jobData = extractLeverJobData();

    chrome.storage.local.get([storageKey], (result) => {
      const existing = result[storageKey] || [];
      existing.push(jobData);
      chrome.storage.local.set({ [storageKey]: existing }, () => {
        console.log("✅ Job saved locally");
      });
    });

    // Option 2 (if Supabase session exists → send directly)
    // FUTURE: We'll add messaging to popup to get Supabase session
  }
});
