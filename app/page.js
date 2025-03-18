"use client";

import Home from "../components/Home";
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
  const { logged, loading } = AuthContext();
  useAuth();

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
