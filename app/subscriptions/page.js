"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import Subscriptions from "@/components/Subscriptions";

export default function SubscriptionsPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading screen...</p>
      ) : logged ? (
        <Subscriptions />
      ) : (
        <p className="text-red-500 text-lg font-semibold">
          User not signed in, logging out...
        </p>
      )}
    </div>
  );
}
