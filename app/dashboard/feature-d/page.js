"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import FeatureD from "@/components/FeatureD";

export default function FeatureDPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <FeatureD />
      ) : (
        <p>User not signed in, Logging out...</p>
      )}
    </>
  );
}
