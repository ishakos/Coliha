"use client";

import { useContext } from "react";
import Login from "../../../components/Login";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { loading, logged } = AuthContext();
  useAuth();

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-300">Loading Screen...</p>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 text-white">
      {!logged ? (
        <Login />
      ) : (
        <p className="text-center text-lg">You are already logged in...</p>
      )}
    </div>
  );
}
