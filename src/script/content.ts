import { addAppliedBadge } from "./applied-badge";
import extractLeverJobData from "./platform/lever";

const storageKey = "job_applications";
chrome.storage.local.get([storageKey], (result) => {
  const existing = result[storageKey] || [];
  const currentUrl = window.location.href;
  const alreadySaved = existing.some((job: { job_url: string }) =>
    currentUrl.includes(job.job_url)
  );

  if (alreadySaved) {
    addAppliedBadge();
  }
});
// document.addEventListener('DOMContentLoaded', () => {
//     chrome.storage.local.get([storageKey], (result) => {
//         const existing = result[storageKey] || [];
//         const currentUrl = window.location.href;

//         const alreadySaved = existing.some((job: {url: string}) => job.url === currentUrl);

//         if (alreadySaved) {
//             addAppliedBadge();
//         }
//     });

// });

// Listen to clicks
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
