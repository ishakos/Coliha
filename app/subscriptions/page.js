"use client";

import { useRedirect } from "../../hooks/useRedirect";
import { AuthContext } from "../../context/authContext";
import Subscriptions from "../../components/subscriptions/Subscriptions";

export default function SubscriptionsPage() {
  const { logged, loading } = AuthContext() || {};
  useRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading screen...</p>
      ) : logged ? (
        <Subscriptions />
      ) : (
        <p className="text-red-500 text-lg font-semibold">Logging out...</p>
      )}
    </div>
  );
}
