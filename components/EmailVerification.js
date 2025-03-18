"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function EmailVerification() {
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { domain } = AuthContext();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    try {
      const urlParts =
        typeof window !== "undefined"
          ? window.location.pathname.split("/")
          : [];
      const token = urlParts[urlParts.length - 1];
      const username = urlParts[urlParts.length - 2];

      axios
        .post(
          `${domain}/users/emailverification/${username}/${token}`,
          { username, token },
          { signal }
        )
        .then((response) => {
          if (response.data.verified) {
            setUpdated(true);
            setLoading(false);
          } else {
            setError("Verification link expired. Please try again.");
          }
        })
        .catch(() => {
          setError(
            "An error occurred while verifying your email. Please try again later."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError("Invalid verification link.");
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup
  }, [domain]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <span className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></span>
            <p className="mt-3 text-gray-400">Verifying email...</p>
          </div>
        ) : updated ? (
          <p className="text-green-400 text-lg font-semibold">
            ✅ Email verified successfully!
          </p>
        ) : (
          <p className="text-red-400 text-lg font-semibold">⚠️ {error}</p>
        )}
      </div>
    </div>
  );
}
