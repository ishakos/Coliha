"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function ResetPassword() {
  const [expired, setExpired] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const { domain } = AuthContext();

  const reset = () => {
    setErrorMsg(null);
    let currentURL = window.location.href.split("/");
    const id = currentURL[currentURL.length - 2];
    const token = currentURL[currentURL.length - 1];
    const data = {
      password: password,
      password2: password2,
      id: id,
      token: token,
    };
    if (password !== password2) {
      setErrorMsg("password does not match");
    } else {
      if (password.length < 3) {
        setErrorMsg("password must be above 3 characters");
      } else {
        axios
          .post(`${domain}/users/resetpassword/:id/:token`, data)
          .then((response) => {
            if (response.data.expired) {
              setExpired(true);
            } else if (response.data.updated) {
              setUpdated(true);
            } else {
              setErrorMsg(response.data.error);
            }
          });
      }
    }
  };

  return (
    <>
      <p>
        If you took more than 15 minutes to open this link, please save your
        time and try again.
      </p>
      {expired ? (
        <>
          <p>Link expired</p>
          <Link style={{ fontWeight: "bold" }} href="/login">
            Go back home
          </Link>
        </>
      ) : updated ? (
        <Updated />
      ) : (
        <div className="login-form">
          {errorMsg ? <span>{errorMsg}</span> : <></>}
          <input
            type="password"
            placeholder="Enter your password"
            onSelect={() => {
              setErrorMsg(() => null);
            }}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Re-Enter your password"
            onSelect={() => {
              setErrorMsg(() => null);
            }}
            onChange={(event) => {
              setPassword2(event.target.value);
            }}
          />
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </>
  );
}

function Updated() {
  return (
    <>
      <span className="sent" style={{ textAlign: "center" }}>
        Password updated succesfully
      </span>
      <Link style={{ fontWeight: "bold" }} href="/login">
        Go back home
      </Link>
    </>
  );
}
