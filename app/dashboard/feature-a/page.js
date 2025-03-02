"use client";

import FeatureA from "@/components/FeatureA";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";

export default function FeatureAPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <FeatureA />
      ) : (
        <p>User not signed in, Logging out...</p>
      )}
    </>
  );
}
