import { useEffect, useState } from "react";
import MainLayout from "./layout";
import { supabase } from "./lib/supabase-client";
// import { useDraftJobsStore } from "./store/use-draft-job-store"; // Keeping imports for now but commenting out unused
import { useJobStore } from "./store/use-job-store";
import { usePopupStore } from "./store/use-popup-store";
import DraftJob from "./features/draft";
import { Login } from "./features/auth"; // Import the auth component we modified earlier

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const jobs = useJobStore((state) => state.jobs);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const clearJobs = useJobStore((state) => state.clearJobs);

  const {
    config: { menu },
  } = usePopupStore();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserEmail(data.session.user.email ?? "");
          fetchJobs();
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Fallback timeout in case Supabase hangs
    const timeoutId = setTimeout(() => setLoading(false), 3000);

    return () => clearTimeout(timeoutId);

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
      if (session?.user) {
        fetchJobs();
      } else {
        clearJobs();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchJobs, clearJobs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-cyan-800">Loading...</div>;

  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto p-4">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-cyan-900">Job Trackr</h1>
          <p className="text-cyan-600 text-sm">Track your applications instantly</p>
        </header>

        <main>
          {!userEmail ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-100">
              <h2 className="text-lg font-semibold mb-4 text-cyan-800 text-center">Welcome Back</h2>
              <Login />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-cyan-100 p-3 rounded-lg">
                <span className="text-sm text-cyan-900 font-medium truncate max-w-[200px]">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-cyan-700 hover:text-cyan-900 hover:bg-cyan-200 px-3 py-1 text-xs border border-cyan-300"
                >
                  Log Out
                </button>
              </div>

              {["linkedin", "lever"].includes(menu) ? (
                <DraftJob />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-cyan-100 overflow-hidden">
                  <div className="p-4 border-b border-cyan-50 flex justify-between items-center">
                    <h3 className="font-semibold text-cyan-900">Your Jobs</h3>
                    <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{jobs.length} Active</span>
                  </div>
                  {jobs.length > 0 ? (
                    <ul className="divide-y divide-cyan-50 max-h-[300px] overflow-y-auto">
                      {jobs.map((job) => (
                        <li key={job.id} className="p-4 hover:bg-cyan-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-cyan-900">{job.job_title}</div>
                              <div className="text-sm text-cyan-600">{job.company_name}</div>
                            </div>
                            <a
                              href={job.p_job_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-cyan-50 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100 px-2 py-1 rounded border border-cyan-200"
                            >
                              View
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-cyan-500 text-sm">
                      No jobs tracked yet.
                      <br />
                      Visit a job post to add one!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}
