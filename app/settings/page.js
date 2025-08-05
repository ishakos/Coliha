"use client";

import { useRedirect } from "../../hooks/useRedirect";
import { AuthContext } from "../../context/authContext";
import Settings from "../../components/settings/Settings";

export default function SettingsPage() {
  const { logged, loading } = AuthContext() || {};
  useRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : logged ? (
        <Settings />
      ) : (
        <p className="text-red-500 text-lg font-semibold">Logging out...</p>
      )}
    </div>
  );
}
