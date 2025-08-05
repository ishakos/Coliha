"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function EmailVerification() {
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { domain } = AuthContext?.() || {};

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParts =
          typeof window !== "undefined"
            ? window.location.pathname?.split?.("/") || []
            : [];
        const token = urlParts?.[urlParts.length - 1];
        const username = urlParts?.[urlParts.length - 2];
        const response = await axios.post(
          `${domain}/users/email-verification/${username}/${token}`
        );
        setUpdated(true);
      } catch (error) {
        let msg;
        if (error?.response?.status === 401) {
          msg = "Link expired. Please request a new verification email link.";
        } else if (error?.response?.status === 400) {
          msg = "User already verified";
        } else {
          msg = "Verification failed. Try again.";
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
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
