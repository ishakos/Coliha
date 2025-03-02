"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import Subscriptions from "@/components/Subscriptions";

export default function SubscriptionsPage() {
  const { logged, loading } = AuthContext();
  useAuth();
  return (
    <>
      {loading ? (
        <p>Loading screen...</p>
      ) : logged ? (
        <Subscriptions />
      ) : (
        <p>User not signed in, logging out...</p>
      )}
    </>
  );
}
