"use client";

import { useRedirect } from "../../../hooks/useRedirect";
import { AuthContext } from "../../../context/authContext";
import Register from "../../../components/auth/Register";

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
