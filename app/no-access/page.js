"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function NoAccessPage() {
  const { loading, logged } = AuthContext();
  useAuth();
  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <>
          <p>NoAccessPage</p>
          <p>
            to get this feature, buy the offer{" "}
            <Link href="/subscriptions">Here</Link>
          </p>
        </>
      ) : (
        <p>User not signed in, logging out...</p>
      )}
    </>
  );
}
