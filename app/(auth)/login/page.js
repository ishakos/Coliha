"use client";

import { useContext } from "react";
import Login from "../../../components/auth/Login";
import { AuthContext } from "@/context/authContext";
import { useRedirect } from "@/hooks/useRedirect";

export default function LoginPage() {
  const { loading, logged } = AuthContext() || {};
  useRedirect();

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 text-white">
      {loading ? (
        <p className="text-center text-lg text-gray-300">Loading Screen...</p>
      ) : !logged ? (
        <Login />
      ) : (
        <p className="text-center text-lg">Logging in...</p>
      )}
    </div>
  );
}
