import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { supabase } from "./lib/supabase-client";
import { useJobStore } from "./store/use-job-store";
import "./styles/style.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const jobs = useJobStore((state) => state.jobs);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const clearJobs = useJobStore((state) => state.clearJobs);

  // Check session on load
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
    <div className="p-4 w-[300px] font-sans text-gray-800">
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
          {jobs.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {jobs.map((job) => (
                <li key={job.id}>
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
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
