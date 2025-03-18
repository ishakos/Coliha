"use client";

import { AuthContext, SubscribeContext } from "@/context/AuthContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function FeatureA() {
  useSubscribe();
  const { domain, orders, user } = AuthContext();
  const { featuresLoading, authorized } = SubscribeContext();
  const router = useRouter();
  const [confirmOrder, setConfirmedOrder] = useState(false);
  const [shippingCompany, setShippingCompany] = useState(null);

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

  const wilayas = [
    { id: 1, name: "Adrar", zone: 4, is_deliverable: 1 },
    { id: 2, name: "Chlef", zone: 2, is_deliverable: 1 },
    { id: 3, name: "Laghouat", zone: 3, is_deliverable: 1 },
    { id: 4, name: "Oum El Bouaghi", zone: 2, is_deliverable: 1 },
    { id: 5, name: "Batna", zone: 2, is_deliverable: 1 },
    { id: 6, name: "Béjaïa", zone: 2, is_deliverable: 1 },
    { id: 7, name: "Biskra", zone: 3, is_deliverable: 1 },
    { id: 8, name: "Béchar", zone: 4, is_deliverable: 1 },
    { id: 9, name: "Blida", zone: 1, is_deliverable: 1 },
    { id: 10, name: "Bouira", zone: 2, is_deliverable: 1 },
    { id: 11, name: "Tamanrasset", zone: 4, is_deliverable: 1 },
    { id: 12, name: "Tébessa", zone: 3, is_deliverable: 1 },
    { id: 13, name: "Tlemcen", zone: 2, is_deliverable: 1 },
    { id: 14, name: "Tiaret", zone: 2, is_deliverable: 1 },
    { id: 15, name: "Tizi Ouzou", zone: 2, is_deliverable: 1 },
    { id: 16, name: "Alger", zone: 1, is_deliverable: 1 },
    { id: 17, name: "Djelfa", zone: 3, is_deliverable: 1 },
    { id: 18, name: "Jijel", zone: 2, is_deliverable: 1 },
    { id: 19, name: "Sétif", zone: 2, is_deliverable: 1 },
    { id: 20, name: "Saïda", zone: 2, is_deliverable: 1 },
    { id: 21, name: "Skikda", zone: 2, is_deliverable: 1 },
    { id: 22, name: "Sidi Bel Abbès", zone: 2, is_deliverable: 1 },
    { id: 23, name: "Annaba", zone: 2, is_deliverable: 1 },
    { id: 24, name: "Guelma", zone: 2, is_deliverable: 1 },
    { id: 25, name: "Constantine", zone: 2, is_deliverable: 1 },
    { id: 26, name: "Médéa", zone: 2, is_deliverable: 1 },
    { id: 27, name: "Mostaganem", zone: 2, is_deliverable: 1 },
    { id: 28, name: "M'Sila", zone: 2, is_deliverable: 1 },
    { id: 29, name: "Mascara", zone: 2, is_deliverable: 1 },
    { id: 30, name: "Ouargla", zone: 3, is_deliverable: 1 },
    { id: 31, name: "Oran", zone: 2, is_deliverable: 1 },
    { id: 32, name: "El Bayadh", zone: 4, is_deliverable: 1 },
    { id: 33, name: "Illizi", zone: 4, is_deliverable: 1 },
    { id: 34, name: "Bordj Bou Arréridj", zone: 2, is_deliverable: 1 },
    { id: 35, name: "Boumerdès", zone: 1, is_deliverable: 1 },
    { id: 36, name: "El Tarf", zone: 2, is_deliverable: 1 },
    { id: 37, name: "Tindouf", zone: 4, is_deliverable: 1 },
    { id: 38, name: "Tissemsilt", zone: 2, is_deliverable: 1 },
    { id: 39, name: "El Oued", zone: 3, is_deliverable: 1 },
    { id: 40, name: "Khenchela", zone: 2, is_deliverable: 1 },
    { id: 41, name: "Souk Ahras", zone: 2, is_deliverable: 1 },
    { id: 42, name: "Tipaza", zone: 2, is_deliverable: 1 },
    { id: 43, name: "Mila", zone: 2, is_deliverable: 1 },
    { id: 44, name: "Aïn Defla", zone: 2, is_deliverable: 1 },
    { id: 45, name: "Naâma", zone: 4, is_deliverable: 1 },
    { id: 46, name: "Aïn Témouchent", zone: 2, is_deliverable: 1 },
    { id: 47, name: "Ghardaïa", zone: 3, is_deliverable: 1 },
    { id: 48, name: "Relizane", zone: 2, is_deliverable: 1 },
    { id: 49, name: "Timimoun", zone: 4, is_deliverable: 1 },
    { id: 50, name: "Bordj Badji Mokhtar", zone: 4, is_deliverable: 0 },
    { id: 51, name: "Ouled Djellal", zone: 4, is_deliverable: 1 },
    { id: 52, name: "Béni Abbès", zone: 4, is_deliverable: 1 },
    { id: 53, name: "In Salah", zone: 4, is_deliverable: 1 },
    { id: 54, name: "In Guezzam", zone: 4, is_deliverable: 0 },
    { id: 55, name: "Touggourt", zone: 4, is_deliverable: 1 },
    { id: 56, name: "Djanet", zone: 4, is_deliverable: 1 },
    { id: 57, name: "El M'Ghair", zone: 4, is_deliverable: 1 },
    { id: 58, name: "El Menia", zone: 4, is_deliverable: 1 },
  ];

  function getWilayaId(cityName) {
    const wilaya = wilayas.find((w) => w.name === cityName);
    return wilaya ? wilaya.id : "0";
  }

  const checkToken = async (company) => {
    let token = "",
      key = "";
    if (company === "zr") {
      token = user.zrtoken || "";
      key = user.zrkey || "";
    }
    if (company === "yalidine") {
      token = user.yalidinetoken || "";
      key = user.yalidinekey || "";
    }
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    try {
      const response = await axios.post(
        `${domain}/shipping/${company}/test-token`,
        {
          token: token,
          key: key,
        },
        config
      );
      if (response.data.key) {
        alert(response.data.key);
        setConfirmedOrder(true);
      } else if (response.data.noKey) {
        alert(response.data.noKey);
      }
    } catch (error) {
      alert(error.response.data.noKey);
    }
  };

  const onSend = async (company) => {
    let colisArray = [];
    let token = "",
      key = "";
    if (company === "zr") {
      token = user.zrtoken || "";
      key = user.zrkey || "";
      colisArray = confirmedOrdersData.map((order, index) => ({
        Tracking: order[12],
        TypeLivraison: order[7] === "Stopdesk" ? "1" : "0",
        TypeColis: order[13],
        Confrimee: "1",
        Client: order[4],
        MobileA: "0" + order[8].slice(4),
        MobileB: "0" + order[9].slice(4),
        Adresse: order[14],
        IDWilaya: "Blida",
        Commune: "Blida",
        //IDWilaya: getWilayaId(order[5]),
        //Commune: order[6], //problem
        Total: order[3],
        Note: order[15],
        TProduit: order[1],
        id_Externe: order[12],
        Source: "",
      }));
    } else if (company === "yalidine") {
      token = user.yalidinetoken || "";
      key = user.yalidinekey || "";
      colisArray = confirmedOrdersData.map((order, index) => ({
        order_id: order[12],
        from_wilaya_name: order[16],
        firstname: order[4],
        //familyname: ".",
        familyname: "a",
        contact_phone: "0" + order[8].slice(4) + ",",
        address: order[14],
        to_commune_name: "Blida",
        to_wilaya_name: "Blida",
        //to_commune_name: order[6], //problem
        //to_wilaya_name: order[5],
        product_list: order[1],
        price: parseInt(order[3]),
        do_insurance: order[10] === "1",
        declared_value: parseInt(order[17]),
        height: 10,
        width: 20,
        length: 30,
        weight: 6,
        freeshipping: false,
        is_stopdesk: order[1] === "Stopdesk",
        stopdesk_id: order[12],
        has_exchange: parseInt(order[13]),
        product_to_collect: null,
      }));
    } else {
      return;
    }
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    try {
      const updateRequests = colisArray.map(() =>
        axios.post(
          `${domain}/shipping/${company}/add-colis`,
          {
            Colis: colisArray,
            token: token,
            key: key,
          },
          config
        )
      );
      // Execute all requests in parallel
      const results = await Promise.allSettled(updateRequests);
      const failedResponses = results
        .filter((res) => res.status !== "fulfilled" || res.value.data.notAdded)
        .map((res) =>
          res.status === "fulfilled" ? res.value.data.notAdded : res.reason
        );
      if (failedResponses.length > 0) {
        alert(
          "Certains colis n'ont pas pu être ajoutés. Vérifiez vos informations."
        );
      } else {
        alert("Tous les colis ont été ajoutés avec succès !");
        window.location.reload();
      }
    } catch (error) {
      alert("Error while sending les collis");
      //window.location.reload();
    }
    //i dont wanna update the sheet bah neb9a ntesta 3la l confirmed orders
    //await onUpdateSheet();
  };

  const onUpdateSheet = async () => {
    if (!confirmedOrders) return;
    try {
      const newData = confirmedOrdersData.map((order) => {
        order[11] = "Onship";
        return order;
      });
      const accessToken = localStorage.getItem("accessToken");
      const updateRequests = confirmedRows.map((row, index) =>
        axios.post(
          `${domain}/orders/update/`,
          {
            sheetID: user.sheetID,
            rowNumber: row,
            newData: newData[index],
          },
          { headers: { accessToken } }
        )
      );
      // Execute all requests in parallel
      const results = await Promise.allSettled(updateRequests);
      const failedUpdates = results.filter((res) => res.status !== "fulfilled");
      if (failedUpdates.length > 0) {
        console.warn("Some updates failed:", failedUpdates);
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Error updating orders");
      window.location.reload();
    }
  };

  const confirmedOrders = orders
    .map((order, index) => ({ order, index }))
    .filter(({ order }) => order[11] === "Confirmed");
  const confirmedRows = confirmedOrders.map(({ index }) => index + 1);
  const confirmedOrdersData = confirmedOrders.map(({ order }) => order);

  return (
    <>
      {featuresLoading ? (
        <p className="text-gray-600 text-center text-lg">Features Loading...</p>
      ) : authorized ? (
        <>
          <div className="bg-white shadow-md rounded-lg mr-5 p-6 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Feature A
            </h1>
            <button
              onClick={onFeature}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Use Feature A
            </button>
          </div>
          {confirmOrder ? (
            <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-md">
              <ConfirmOrders confirmedOrders={confirmedOrdersData} />
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
                onClick={() => onSend(shippingCompany)}
              >
                Confirm Order
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-md">
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
                  className="px-6 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition"
                  onClick={() => {
                    checkToken("yalidine");
                    setShippingCompany("yalidine");
                  }}
                >
                  Create Yalidine Order
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500 text-center text-lg font-medium">
          You cannot access this feature
        </p>
      )}
    </>
  );
}

function ConfirmOrders({ confirmedOrders }) {
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
        {confirmedOrders.map((order, index) => (
          <React.Fragment key={index}>
            {/* EDIT FORM */}
            <>
              {/* MAIN ORDER ROW */}
              <tr className="border">
                <td className="border p-2">{order[1]}</td>
                <td className="border p-2">{order[2]}</td>
                <td className="border p-2">{order[3]}</td>
                <td className="border p-2">{order[4]}</td>
                <td className="border p-2">{order[5]}</td>
                <td className="border p-2">{order[7]}</td>
                <td className="border p-2">{order[8]}</td>
                <td className="border p-2">{order[15]}</td>
                <td className="border p-2">{order[11]}</td>
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
                      <strong>Commune:</strong> {order[6]}
                    </p>
                    <p>
                      <strong>Delivery Type:</strong> {order[7]}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order[8]}
                    </p>
                    <p>
                      <strong>Phone2:</strong> {order[9]}
                    </p>
                    <p>
                      <strong>Insurance:</strong> {order[10]}
                    </p>
                    <p>
                      <strong>Status:</strong> {order[11]}
                    </p>
                    <p>
                      <strong>ID:</strong> {order[12]}
                    </p>
                    <p>
                      <strong>Exchange:</strong> {order[13]}
                    </p>
                    <p>
                      <strong>Address:</strong> {order[14]}
                    </p>
                    <p>
                      <strong>Note:</strong> {order[15]}
                    </p>
                    <p>
                      <strong>From:</strong> {order[16]}
                    </p>
                    <p>
                      <strong>Declared:</strong> {order[17]}
                    </p>
                    <p>
                      <strong>Date:</strong> {order[18]}
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
