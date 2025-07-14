"use client";

import Home from "../components/Home";
import { AuthContext } from "../context/authContext";
import { useRedirect } from "@/hooks/useRedirect";

export default function App() {
  const { logged, loading } = AuthContext() || {};
  useRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : !logged ? (
        <Home />
      ) : (
        <p className="text-blue-600 text-lg font-semibold">Logging in...</p>
      )}
    </div>
  );
}
