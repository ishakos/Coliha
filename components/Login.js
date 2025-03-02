"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [logging, setLogging] = useState(false);
  const router = useRouter();
  const { domain } = AuthContext();

  const containerStyles = {
    opacity: logging ? 0.6 : 1,
    pointerEvents: logging ? "none" : "auto",
  };

  const login = () => {
    if (!username || !password) return;
    setLogging(true);
    const data = { username: username, password: password };
    axios.post(`${domain}/users/login/`, data).then((response) => {
      if (response.data.noExist) {
        setError1(true);
      } else if (response.data.wrongPass) {
        setError2(true);
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
        router.push("/dashboard");
      }
      setLogging(false);
    });
  };

  return (
    <div className="login-form" style={containerStyles}>
      <Hint1 error1={error1} />
      <input
        type="text"
        placeholder="username"
        required
        onSelect={() => {
          setError1(() => !true);
          setError2(() => !true);
        }}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <Hint2 error2={error2} />
      <input
        type="password"
        placeholder="password"
        required
        onSelect={() => {
          setError1(() => !true);
          setError2(() => !true);
        }}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button type="submit" onClick={login}>
        Login
      </button>
      <Link href="/register">Register</Link>
      <Link href="/forgot-password" target="_blank" rel="noopener noreferrer">
        Forgot Password
      </Link>
    </div>
  );
}

function Hint1({ error1 }) {
  return (
    <>
      {error1 ? (
        <span className="error-username">User Does Not Exist</span>
      ) : (
        <></>
      )}
    </>
  );
}

function Hint2({ error2 }) {
  return (
    <>
      {error2 ? <span className="error-username">Wrong Password</span> : <></>}
    </>
  );
}
