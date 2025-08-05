"use client";

import FeatureB from "../../../components/dashboard/FeatureB";
import { useRedirect } from "../../../hooks/useRedirect";
import { useSubscribe } from "../../../hooks/useSubscribe";
import { AuthContext } from "../../../context/authContext";

export default function FeatureBPage() {
  const { logged, loading } = AuthContext() || {};
  useRedirect();
  useSubscribe();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : logged ? (
        <FeatureB />
      ) : (
        <p className="text-red-500 text-lg font-semibold">Logging out...</p>
      )}
    </div>
  );
}
