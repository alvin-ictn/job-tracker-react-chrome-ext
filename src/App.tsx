import { useEffect, useState } from "react";
import MainLayout from "./layout";
import { supabase } from "./lib/supabase-client";
import { useDraftJobsStore } from "./store/use-draft-job-store";
import { useJobStore } from "./store/use-job-store";
import { usePopupStore } from "./store/use-popup-store";
import DraftJob from "./features/draft";

const storageKey = "job_applications";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const jobs = useJobStore((state) => state.jobs);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const clearJobs = useJobStore((state) => state.clearJobs);
  const { jobs: draftJobs, addJob } = useDraftJobsStore();
  const {
    config: { menu },
  } = usePopupStore();

  console.log("TEST", draftJobs);
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email ?? "");
        await fetchJobs();
      }
      setLoading(false);
    }
    checkSession();
  }, [fetchJobs]);

  useEffect(() => {
    chrome?.storage?.local?.get?.([storageKey], (result) => {
      const savedJobs = result[storageKey] || [];
      addJob(savedJobs);
    });

    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes[storageKey]) {
        const newValue = changes[storageKey].newValue || [];
        addJob(newValue);
      }
    };

    chrome?.storage?.onChanged?.addListener(handleChange);

    // Cleanup listener on unmount
    return () => chrome?.storage?.onChanged?.removeListener(handleChange);
  }, [addJob]);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      setUserEmail(data.user?.email || null);
      await fetchJobs();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    clearJobs();
    setEmail("");
    setPassword("");
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <MainLayout
    // className="p-4 w-[300px] font-sans text-gray-800"
    >
      <h2 className="text-xl font-bold mb-4">Job Tracker Extension</h2>

      {!userEmail ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Log In
          </button>
        </>
      ) : (
        <>
          <p className="mb-2">
            Logged in as <strong>{userEmail}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white rounded p-2 mb-4 hover:bg-red-700"
          >
            Log Out
          </button>
          <h3 className="text-lg font-semibold mb-2">Saved Applications</h3>
          {["linkedin", "lever"].includes(menu) ? (
            <DraftJob/>
          ) : jobs.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {jobs.map((job) => (
                <li key={job.id}>
                  <strong>{job.job_title}</strong> at {job.company_name}
                  <br />
                  <a
                    href={job.p_job_url}
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
        </>
      )}
    </MainLayout>
  );
}
