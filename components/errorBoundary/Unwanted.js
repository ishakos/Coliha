"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AuthContext } from "../../context/authContext";

export default function Unwanted() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const { setLogged, setPurchasedOffer, setImageUrl, setOrders, setUser } =
    AuthContext?.() || {};

  useEffect(() => {
    setLogged?.(false);
    setPurchasedOffer?.([]);
    setImageUrl?.(null);
    setOrders?.([]);
    setUser?.({});
  }, [setImageUrl, setLogged, setOrders, setPurchasedOffer, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-2">⚠️ Uh oh!</h1>
      <p className="text-lg text-gray-400 mb-4">
        {error
          ? `Error: ${error}`
          : "Something went wrong in the servers. Please log in again"}
      </p>
      <button
        onClick={() => {
          router?.push("/login");
        }}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition"
      >
        🔄 Go Home
      </button>
    </div>
  );
}
