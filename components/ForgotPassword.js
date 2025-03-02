"use client";

import { AuthContext } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const { domain } = AuthContext();

  const submit = () => {
    setRequestLoading(true);
    axios
      .post(`${domain}/users/forgotpassword`, { email: email })
      .then((response) => {
        if (response.data.noEmail) {
          setError(true);
        } else {
          setSent(true);
          if (response.data.error) {
            setFailed(true);
          }
        }
      });
    setRequestLoading(false);
  };

  const containerStyles = {
    opacity: requestLoading ? 0.6 : 1,
    pointerEvents: requestLoading ? "none" : "auto",
  };

  return (
    <>
      {sent ? (
        <>
          {failed ? <p>Request failed, try again</p> : <p>check ur email</p>}
          <button
            onClick={() => {
              setFailed(false);
              setSent(false);
            }}
          >
            retry
          </button>
        </>
      ) : (
        <div className="login-form" style={containerStyles}>
          {error ? <p>email does not exist</p> : <></>}
          <input
            type="email"
            value={email}
            placeholder="email"
            onSelect={() => {
              setError(() => !true);
            }}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <button type="submit" onClick={submit}>
            Submit
          </button>
        </div>
      )}
    </>
  );
}
