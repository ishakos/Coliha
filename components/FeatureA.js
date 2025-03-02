"use client";

import { AuthContext, SubscribeContext } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSubscribe } from "@/hooks/useSubscribe";
import { useRef, useState } from "react";
import { clearPreviewData } from "next/dist/server/api-utils";

export default function FeatureA() {
  useSubscribe();
  const { domain, orders, user } = AuthContext();
  const { featuresLoading, authorized } = SubscribeContext();
  const router = useRouter();

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

  const confirmedOrders = orders
    .map((order, index) => ({ order, index }))
    .filter(({ order }) => order[11] === "Confirmed");
  const confirmedRows = confirmedOrders.map(({ index }) => index + 1);
  const confirmedOrdersData = confirmedOrders.map(({ order }) => order);

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

  return (
    <>
      {featuresLoading ? (
        <p>Features Loading...</p>
      ) : authorized ? (
        confirmOrder ? (
          <>
            <ConfirmOrders confirmedOrders={confirmedOrdersData} />
            <button
              onClick={() => {
                onSend(shippingCompany);
              }}
            >
              Confirm
            </button>
          </>
        ) : (
          <div>
            <button onClick={onFeature}>Feature A</button>
            <button
              onClick={() => {
                checkToken("zr");
                setShippingCompany("zr");
              }}
            >
              Create Zr express Order
            </button>
            <button
              onClick={() => {
                checkToken("yalidine");
                setShippingCompany("yalidine");
              }}
            >
              Create Yalidine Order
            </button>
          </div>
        )
      ) : (
        <p>Cant access this feature</p>
      )}
    </>
  );
}

function ConfirmOrders({ confirmedOrders }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Store</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Client</th>
          <th>City</th>
          <th>Commune</th>
          <th>Delivery Type</th>
          <th>Phone</th>
          <th>Phone2</th>
          <th>insurance</th>
          <th>State</th>
          <th>ID</th>
          <th>Exchange</th>
          <th>Address</th>
          <th>Note</th>
          <th>From</th>
          <th>Declared</th>
          <th>Date</th>
        </tr>
      </thead>
      {confirmedOrders?.map((order, index) => {
        return <Order key={index + 1} order={order} />;
      })}
    </table>
  );
}

function Order({ order }) {
  return (
    <>
      <tbody>
        <tr>
          {order?.map((column, i) => (
            <td key={i}>{column}</td>
          ))}
        </tr>
      </tbody>
    </>
  );
}
