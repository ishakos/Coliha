"use client";

import FeatureA from "../../../components/dashboard/FeatureA";
import { useRedirect } from "../../../hooks/useRedirect";
import { useSubscribe } from "../../../hooks/useSubscribe";
import { AuthContext } from "../../../context/authContext";

export default function FeatureAPage() {
  const { logged, loading } = AuthContext() || {};
  useRedirect();
  useSubscribe();

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : logged ? (
        <FeatureA />
      ) : (
        <p className="text-red-500 text-lg font-semibold">Logging out...</p>
      )}
    </div>
  );
}
