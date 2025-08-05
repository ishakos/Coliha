"use client";

import { useRedirect } from "@/hooks/useRedirect";
import Register from "@/components/auth/Register";
import { AuthContext } from "@/context/AuthContext";

export default function RegisterPage() {
  const { loading, logged } = AuthContext() || {};
  useRedirect();

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 text-white">
      {loading ? (
        <p className="text-center text-lg text-gray-300">Loading Screen...</p>
      ) : !logged ? (
        <Register />
      ) : (
        <p className="text-center text-lg">Logging in...</p>
      )}
    </div>
  );
}
