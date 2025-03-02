"use client";

import Home from "../components/Home";
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : !logged ? (
        <Home />
      ) : (
        <p>Logging in...</p>
      )}
    </>
  );
}
