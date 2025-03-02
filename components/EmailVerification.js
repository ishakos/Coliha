"use client";

import { AuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EmailVerification() {
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { domain } = AuthContext();

  useEffect(() => {
    const url = window.location.href.split("/");
    const token = url[url.length - 1];
    const username = url[url.length - 2];
    const data = { username: username, token: token };
    axios
      .post(`${domain}/users/emailverification/:username/:token`, data)
      .then((response) => {
        if (response.data.verified) {
          setUpdated(true);
        } else if (response.data.error) {
          window.location.reload();
        } else {
          setUpdated(false);
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <h1>Verifying...</h1>
      ) : (
        <>
          {updated ? <h1>Email Verified</h1> : <h1>Link Expired, Try again</h1>}
        </>
      )}
    </>
  );
}
