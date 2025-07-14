"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);
  const { domain, setRefresh } = AuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLogging(true);
    try {
      const { data } = await axios.post(`${domain}/users/login`, {
        username,
        password,
      });
      localStorage.setItem("accessToken", data);
      setRefresh?.((prev) => !prev);
    } catch (err) {
      if (err?.response?.status === 404) {
        if (err?.response?.data?.noUser) {
          setError("User does not exist.");
        } else if (err?.response?.data?.wrongPassword) {
          setError("Wrong password.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-25 justify-center bg-gray-900 text-white">
      <div
        className={`bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-md ${
          logging ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white mb-3 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white mb-3 focus:outline-none"
        />

        <button
          type="submit"
          onClick={handleLogin}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition"
          disabled={logging}
        >
          {logging ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
          <Link
            href="/forgot-password"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
