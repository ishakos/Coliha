"use client";

import { AuthContext } from "@/context/authContext";
import { SubscribeContext } from "@/context/subscribeContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Wilayas from "@/utils/wilayasData";

export default function FeatureB() {
  const { domain, orders, user } = AuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const { featuresPageLoading, authorized } = SubscribeContext();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [shippingCompany, setShippingCompany] = useState(null);
  const [checking, setChecking] = useState(false);
  const containerStyle = checking ? "pointer-events-none opacity-60" : "";

  const confirmedOrders = orders
    ?.map((order, index) => ({ order, index }))
    .filter(({ order }) => order?.[11] === "Confirmed");

  // Confirmed orders data
  const confirmedOrdersData = confirmedOrders?.map(({ order }) => order);

  //Get the indices of confirmed orders in the original orders array (useful for updating the orders later)
  const realIndices = confirmedOrders?.map(({ order: confirmedOrder }) =>
    orders.findIndex(
      (order) => JSON.stringify(order) === JSON.stringify(confirmedOrder)
    )
  );
  function getWilayaIdByName(name) {
    const wilaya = Wilayas?.find((w) => w?.name === name);
    return wilaya ? wilaya.id : null;
  }

  //preparing the packages array to send to the shipping company
  function getPackagesArray() {
    // Some special cases so the IDWilaya works properly
    const padWilayas = ["Béjaïa", "Biskra", "Béchar", "Blida"];
    return (
      confirmedOrdersData &&
      confirmedOrdersData.map((order, index) => {
        const wilayaName = order?.[5];
        const wilayaId = getWilayaIdByName(wilayaName);
        const IDWilaya =
          padWilayas.indexOf(wilayaName) !== -1
            ? `0${wilayaId}`
            : `${wilayaId}`;

        return {
          Tracking: order?.[12], // id
          TypeLivraison: order?.[7] === "Stopdesk" ? "1" : "0",
          TypeColis: order?.[13] === true ? "1" : "0", // Exchange
          Confrimee: "",
          Client: order?.[4],
          MobileA: order?.[8],
          MobileB: order?.[9],
          Adresse: order?.[14],
          IDWilaya: IDWilaya,
          Commune: order?.[6],
          Total: order?.[3],
          Note: order?.[15] || "",
          TProduit: order?.[1],
          id_Externe: order?.[12], // id
          Source: "",
        };
      })
    );
  }

  const checkToken = async (company) => {
    const routes = pathname?.split("/");
    const currentPage = routes?.[routes.length - 1];
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
        currentPage: currentPage || "",
        offerId: offerId || "",
      },
    };
    setChecking(true);
    let token = "",
      key = "";
    if (company === "zr") {
      token = user?.zrtoken || "";
      key = user?.zrkey || "";
    }
    if (company === "yalidine") {
      return;
    }
    try {
      const response = await axios.post(
        domain + "/shipping/" + company + "/test-token",
        {
          token: token,
          key: key,
        },
        config
      );
      setTokenChecked(true);
      setChecking(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        const msg = "Out of session, Please log in again.";
        router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
        localStorage.removeItem("accessToken");
      } else if (err?.response?.status === 404) {
        toast.error("Invalid API key or token");
        setChecking(false);
      } else if (err?.response?.status === 403) {
        toast.error("You are not subscribed to this feature.");
        router.push("no-access");
      } else {
        toast.error("An error occurred. Please try again.");
        setChecking(false);
      }
    }
  };

  const onSend = async (company) => {
    setChecking(true);
    let packagesArray = [];
    let token = "",
      key = "";
    if (company === "zr") {
      token = user?.zrtoken || "";
      key = user?.zrkey || "";
      packagesArray = getPackagesArray();
    } else {
      //worry about Yalidine in another day
      setChecking(false);
      return;
    }
    const routes = pathname?.split("/");
    const currentPage = routes?.[routes.length - 1];
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
        currentPage: currentPage || "",
        offerId: offerId || "",
      },
    };
    try {
      const updateResults =
        packagesArray &&
        packagesArray.map((colis, index) =>
          (async () => {
            // 1. Send the packages to the shipping company
            await axios.post(
              `${domain}/shipping/${company}/add-colis`,
              {
                Colis: [colis], // one colis per request
                token,
                key,
              },
              config
            );

            // 2. Change to Onship state
            try {
              await axios.post(
                domain + "/orders/update/",
                {
                  sheetID: user?.sheetID,
                  rowNumber: realIndices?.[index] + 1,
                  newData: [
                    ...orders?.[realIndices?.[index]]?.slice(0, 11),
                    "Onship",
                    ...orders?.[realIndices?.[index]]?.slice(12),
                  ],
                },
                config
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      const results = await Promise.allSettled(updateResults);
      const failed = results?.filter((res) => res?.status === "rejected");

      const total = packagesArray?.length;
      const failedCount = failed?.length;
      const successCount = total - failedCount;

      if (failedCount === total) {
        toast.error(`No parcels could be added or updated.`);
      } else if (failedCount === 0) {
        toast.success(`All parcels have been added and updated successfully!`);
      } else {
        toast.error(`${failedCount} parcels could not be added or updated.`);
        toast.success(
          `${successCount} parcels have been added and updated successfully!`
        );
      }
    } catch (error) {
      toast.error("Global error while sending parcels.");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <>
      {featuresPageLoading ? (
        <p className="text-gray-600 text-center text-lg">Page Loading...</p>
      ) : !authorized ? (
        <p className="text-red-500 text-center text-lg font-medium">
          You cannot access this feature
        </p>
      ) : (
        <>
          {tokenChecked ? (
            <TokenChecked
              containerStyle={containerStyle}
              confirmedOrdersData={confirmedOrdersData}
              setTokenChecked={setTokenChecked}
              onSend={onSend}
              shippingCompany={shippingCompany}
            />
          ) : (
            <div
              className={`flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-md ${containerStyle}`}
            >
              <h2 className="text-xl font-semibold text-gray-700">
                Select a Shipping Company
              </h2>
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                  onClick={() => {
                    checkToken("zr");
                    setShippingCompany("zr");
                  }}
                >
                  Create Zr Express Order
                </button>
                <button
                  className="px-6 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition pointer-events-none opacity-60"
                  onClick={() => {}}
                >
                  Create Yalidine Order
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function TokenChecked({
  containerStyle,
  confirmedOrdersData,
  setTokenChecked,
  onSend,
  shippingCompany,
}) {
  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-md ${containerStyle}`}
    >
      {confirmedOrdersData?.length > 0 && (
        <>
          <ConfirmedOrders confirmedOrdersData={confirmedOrdersData} />
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
            onClick={() => onSend(shippingCompany)}
          >
            Confirm Order
          </button>
        </>
      )}
      <button
        className="px-6 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
        onClick={() => setTokenChecked(false)}
      >
        Go back
      </button>
    </div>
  );
}

function ConfirmedOrders({ confirmedOrdersData }) {
  const [expandedRow, setExpandedRow] = useState(null);
  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Product</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Client</th>
          <th className="border p-2">City</th>
          <th className="border p-2">Delivery</th>
          <th className="border p-2">Phone</th>
          <th className="border p-2">Note</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {confirmedOrdersData?.map((order, index) => (
          <React.Fragment key={index}>
            {/* EDIT FORM */}
            <>
              {/* MAIN ORDER ROW */}
              <tr className="border">
                <td className="border p-2">{order?.[1]}</td>
                <td className="border p-2">{order?.[2]}</td>
                <td className="border p-2">{order?.[3]}</td>
                <td className="border p-2">{order?.[4]}</td>
                <td className="border p-2">{order?.[5]}</td>
                <td className="border p-2">{order?.[7]}</td>
                <td className="border p-2">{order?.[8]}</td>
                <td className="border p-2">{order?.[15]}</td>
                <td className="border p-2">{order?.[11]}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded"
                    onClick={() =>
                      setExpandedRow(expandedRow === index ? null : index)
                    }
                  >
                    {expandedRow === index ? "Hide" : "Show More"}
                  </button>
                </td>
              </tr>

              {/* EXPANDED DETAILS */}
              {expandedRow === index && (
                <tr>
                  <td colSpan="9" className="border p-2 bg-gray-100">
                    <p>
                      <strong>Commune:</strong> {order?.[6]}
                    </p>
                    <p>
                      <strong>Delivery Type:</strong> {order?.[7]}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order?.[8]}
                    </p>
                    <p>
                      <strong>Phone2:</strong> {order?.[9]}
                    </p>
                    <p>
                      <strong>Address:</strong> {order?.[14]}
                    </p>
                    <p>
                      <strong>Note:</strong> {order?.[15]}
                    </p>
                    <p>
                      <strong>Status:</strong> {order?.[11]}
                    </p>
                    <p>
                      <strong>Exchange:</strong> {order?.[13] ? "Yes" : "No"}
                    </p>

                    <p>
                      <strong>ID:</strong> {order?.[12]}
                    </p>
                    <p>
                      <strong>Date:</strong> {order?.[18]}
                    </p>
                  </td>
                </tr>
              )}
            </>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
