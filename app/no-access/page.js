"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function NoAccessPage() {
  const { loading, logged } = AuthContext();
  useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-6">
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading Screen...</p>
      ) : logged ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-500">No Access</h1>
          <p className="mt-4 text-gray-600">
            To access this feature, purchase an offer{" "}
            <Link
              href="/subscriptions"
              className="text-blue-500 font-semibold hover:underline"
            >
              Here
            </Link>
            .
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">
          User not signed in, logging out...
        </p>
      )}
    </div>
  );
}
