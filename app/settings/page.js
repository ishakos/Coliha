"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import Settings from "@/components/Settings";

export default function SettingsPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <Settings />
      ) : (
        <p>User not signed in, logging out...</p>
      )}
    </>
  );
}
