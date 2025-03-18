"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import FeatureC from "@/components/FeatureC";

export default function FeatureCPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : logged ? (
        <FeatureC />
      ) : (
        <p className="text-red-500 text-lg font-semibold">
          User not signed in, Logging out...
        </p>
      )}
    </div>
  );
}
