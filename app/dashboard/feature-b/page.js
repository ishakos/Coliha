"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import FeatureB from "@/components/FeatureB";

export default function FeatureBPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <FeatureB />
      ) : (
        <p>User not signed in, Logging out...</p>
      )}
    </>
  );
}
