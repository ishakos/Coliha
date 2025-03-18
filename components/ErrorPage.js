"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-2">⚠️ Oops!</h1>
      <p className="text-lg text-gray-400 mb-4">
        A server error occurred. Please try again later.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition"
      >
        🔄 Go Back
      </button>
    </div>
  );
}
