"use client";

import { AuthContext, SubscribeContext } from "@/context/AuthContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FeatureA() {
  useSubscribe();
  const { domain } = AuthContext();
  const { featuresLoading, authorized } = SubscribeContext();
  const router = useRouter();

  const onFeature = () => {
    const data = {
      currentPage: "feature-a",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {featuresLoading ? (
        <p className="text-lg font-semibold text-gray-700">
          Features Loading...
        </p>
      ) : authorized ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Feature A</h1>
          <button
            onClick={onFeature}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Use Feature A
          </button>
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">
          You can not access this feature
        </p>
      )}
    </div>
  );
}
