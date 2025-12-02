"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CLIENTS: Record<string, string> = {
  OAT: "OATX",
  TABIS: "TABISX",
};

interface LoginFormProps {}

export default function LoginForm({}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    const correctPassword = CLIENTS[username.toUpperCase()];

    if (!correctPassword || correctPassword !== password) {
      setError("Invalid username or password.");
      return;
    }

    // Store logged-in client in sessionStorage
    sessionStorage.setItem("clientName", username.toUpperCase());

    // Redirect to client dashboard
    router.push("/client-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-20"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Client Login</h1>

      <label className="block mt-2">Client Name</label>
      <input
        type="text"
        className="input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="block mt-2">Password</label>
      <input
        type="password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        type="submit"
        className="w-full mt-4 bg-black text-white py-2 rounded-lg"
      >
        Login
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-top: 4px;
        }
      `}</style>
    </form>
  );
}
