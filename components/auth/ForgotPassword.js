"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import axios from "axios";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const { domain } = AuthContext?.();

  const submit = async () => {
    setRequestLoading(true);
    setError(false);
    setFailed(false);
    try {
      const response = await axios.post(`${domain}/users/forgot-password`, {
        email,
      });
      setSent(true);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError(true);
      } else {
        setSent(true);
        setFailed(true);
      }
    } finally {
      setRequestLoading(false);
    }
  };

  if (sent && failed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <p className="text-lg text-red-500">Request failed, try again.</p>
            <button
              onClick={() => {
                setFailed(false);
                setSent(false);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sent && !failed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <p className="text-lg text-green-400">
              ✅ Check your email for password reset instructions!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        <div
          className={`space-y-4 ${
            requestLoading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
          {error && (
            <p className="text-red-500 text-sm">❌ Email does not exist</p>
          )}
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(event) => setEmail(event?.target?.value)}
            className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            onClick={submit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center"
            disabled={requestLoading}
          >
            {requestLoading ? (
              <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
