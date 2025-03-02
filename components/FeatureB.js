"use client";

import { AuthContext, SubscribeContext } from "@/context/AuthContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FeatureB() {
  useSubscribe();
  const { domain } = AuthContext();
  const { featuresLoading, authorized } = SubscribeContext();
  const router = useRouter();

  const onFeature = () => {
    const data = {
      currentPage: "feature-b",
    };
    const config = {
      headers: {
        subscribeToken: sessionStorage.getItem("subscribeToken") || "",
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    axios.post(`${domain}/subscribers/auth`, data, config).then((response) => {
      if (response.data.noToken) {
        router.push("/unwanted-page");
        sessionStorage.clear();
        localStorage.clear();
      }
      if (response.data.subscribed) {
        alert(response.data.subscribed);
      } else if (response.data.notAllowed) {
        alert("User can't use this feature");
        router.push("/dashboard");
      } else {
        alert(response.data.error);
      }
    });
  };

  return (
    <>
      {featuresLoading ? (
        <p>Features Loading...</p>
      ) : authorized ? (
        <div>
          <button onClick={onFeature}>Feature B</button>
        </div>
      ) : (
        <p>Cant access this feature</p>
      )}
    </>
  );
}
