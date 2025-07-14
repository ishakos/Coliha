"use client";

import { AuthContext } from "@/context/authContext";
import { SubscribeContext } from "@/context/subscribeContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function FeatureC() {
  const { user, domain } = AuthContext();
  const { featuresPageLoading, authorized } = SubscribeContext();
  const router = useRouter();

  const onFeature = async () => {
    const currentPage = "feature-c";
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        currentPage: currentPage,
        offerId: offerId || "",
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    try {
      const response = await axios.post(
        `${domain}/subscribers/check-access`,
        {},
        config
      );
      toast.success(`User subscribed to ${currentPage}`);
    } catch (err) {
      if (err?.response?.status === 401) {
        const msg = "Your session has expired. Please log in again.";
        router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
        localStorage.removeItem("accessToken");
      } else if (err?.response?.status === 403) {
        toast.error("User can not use this feature.");
        router.push("/no-access");
      } else {
        toast.error("Oops. something went wrong, try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        {featuresPageLoading ? (
          <p className="text-lg font-semibold text-gray-700">Page Loading...</p>
        ) : authorized ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Feature C
            </h1>
            <button
              onClick={onFeature}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Use Feature C
            </button>
          </div>
        ) : (
          <p className="text-red-500 text-lg font-semibold">
            You can not access this feature
          </p>
        )}
      </div>
    </>
  );
}
