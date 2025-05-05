import { useState } from "react";
import { supabase } from "../lib/supabase-client";
import { useJobStore } from "../store/use-job-store";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchJobs = useJobStore((state) => state.fetchJobs);

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
  return (
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
        Log In {userEmail}
      </button>
    </>
  );
}
