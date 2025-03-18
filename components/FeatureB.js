"use client";

import { AuthContext, SubscribeContext } from "@/context/AuthContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import axios from "axios";
import { useRouter } from "next/navigation";
import OrdersAnalytics from "./OrdersAnalytics";

export default function FeatureB() {
  useSubscribe();
  const { domain, orders } = AuthContext();
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
    <div className="grid gap-6 w-full max-w-4xl mx-auto p-6">
      {featuresLoading ? (
        <p className="text-lg font-semibold text-gray-700">
          Features Loading...
        </p>
      ) : authorized ? (
        <>
          {/* Feature Box */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Feature B
            </h1>
            <button
              onClick={onFeature}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Use Feature B
            </button>
          </div>

          {/* Orders Analytics Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <OrdersAnalytics orders={orders} />
          </div>
        </>
      ) : (
        <p className="text-red-500 text-lg font-semibold">
          You cannot access this feature
        </p>
      )}
    </div>
  );
}
