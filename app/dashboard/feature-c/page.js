"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import FeatureC from "@/components/FeatureC";

export default function FeatureCPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <FeatureC />
      ) : (
        <p>User not signed in, Logging out...</p>
      )}
    </>
  );
}
