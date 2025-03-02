"use client";

import Login from "../../../components/Login";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { loading, logged } = AuthContext();
  useAuth();
  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : !logged ? (
        <div className="login">
          LOGIN PAGE
          <Login />
        </div>
      ) : (
        <p>Logging in...</p>
      )}
    </>
  );
}
