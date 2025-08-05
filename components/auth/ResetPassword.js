"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AuthContext } from "@/context/authContext";

export default function ResetPassword() {
  const [expired, setExpired] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { domain } = AuthContext();

  //check if link is still valid
  useEffect(() => {
    const checkToken = async () => {
      let id, token, pathParts;
      if (typeof window !== "undefined") {
        pathParts = window.location.pathname?.split("/");
        id = pathParts?.[pathParts.length - 2];
        token = pathParts?.[pathParts.length - 1];
      }
      try {
        await axios.post(`${domain}/users/check-token-rs/${id}/${token}`);
      } catch (error) {
        if (error?.response?.status === 401) {
          setExpired(true);
        }
        //we will check anyways later if link is expired so no need to hurry and kick the user out
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [domain]);

  //reset password
  const reset = async () => {
    let id, token, pathParts;
    if (typeof window !== "undefined") {
      pathParts = window.location.pathname?.split("/");
      id = pathParts?.[pathParts.length - 2];
      token = pathParts?.[pathParts.length - 1];
    }
    setErrorMsg(null);

    if (!password || !password2) {
      setErrorMsg("Both fields are required");
      return;
    }
    if (password.length < 3) {
      setErrorMsg("Password must be at least 3 characters");
      return;
    }
    if (password.length > 20) {
      setErrorMsg("Password must be less than 20 characters");
      return;
    }
    if (password !== password2) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${domain}/users/reset-password/${id}/${token}`,
        {
          password,
          password2,
        }
      );
      setUpdated(true);
    } catch (error) {
      if (error?.response) {
        if (error.response.status === 400) {
          setErrorMsg("Passwords do not match.");
        } else if (error.response.status === 401) {
          setExpired(true);
        } else {
          setErrorMsg("An error occurred. Please try again.");
        }
      } else {
        setErrorMsg("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 ${
        loading ? "opacity-90 pointer-events-none" : ""
      }`}
    >
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        {expired ? (
          <Expired />
        ) : updated ? (
          <Updated />
        ) : (
          <div className="space-y-4">
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <input
              type="password"
              placeholder="Enter your new password"
              onFocus={() => setErrorMsg(null)}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Re-enter your password"
              onFocus={() => setErrorMsg(null)}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <button
              onClick={reset}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Updated() {
  return (
    <div className="text-center">
      <p className="text-green-400 font-semibold text-lg">
        ✅ Password updated successfully!
      </p>
      <Link href="/login" className="font-bold text-blue-400 hover:underline">
        Go back home
      </Link>
    </div>
  );
}

function Expired() {
  return (
    <div className="text-center">
      <p className="text-red-500 font-semibold text-lg">⚠️ Link expired</p>
      <Link href="/login" className="font-bold text-blue-400 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
