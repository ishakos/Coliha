import React, { useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Dashboard() {
  const { purchasedOffer, user, orders, setOrders, domain } = AuthContext();

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRandomOrders() {
    const stores = ["Shopify", "Foorweb"];
    const products = ["Shoes", "Pants", "T-Shirt"];
    const statuses = [
      "Confirmed",
      "Canceled",
      "Non Confirmed",
      "Onship",
      "Back",
    ];
    const dtypes = ["Domicile", "Stopdesk"];
    const cities = [
      "Alger",
      "Oran",
      "Constantine",
      "Annaba",
      "Batna",
      "Blida",
      "Tlemcen",
      "Béjaïa",
      "Sétif",
      "Biskra",
      "Tiaret",
      "Djelfa",
      "Mostaganem",
      "Skikda",
      "Tizi Ouzou",
      "Médéa",
      "Sidi Bel Abbès",
      "El Oued",
      "Ghardaïa",
      "Aïn Defla",
      "Relizane",
      "Tamanrasset",
      "Mascara",
      "Khenchela",
      "Jijel",
      "Ouargla",
      "Saïda",
      "Laghouat",
      "M'Sila",
      "Bouira",
      "Naâma",
      "Adrar",
      "Illizi",
      "El Bayadh",
      "Boumerdès",
      "Tindouf",
      "Aïn Témouchent",
      "Guelma",
      "Tissemsilt",
      "Souk Ahras",
      "Tipaza",
      "Bordj Bou Arréridj",
      "El Tarf",
      "Tébessa",
      "Mila",
      "Oum El Bouaghi",
      "El M'Ghair",
      "El Menia",
      "Touggourt",
      "Béni Abbès",
      "Timimoun",
      "Djanet",
      "In Salah",
      "In Guezzam",
    ];

    let orders = [];

    let store = getRandomElement(stores);
    let product = getRandomElement(products);
    let quantity = Math.floor(Math.random() * 5);
    let price = Math.floor(Math.random() * 91) + 10;
    let client = `Client${Math.floor(Math.random() * 1000)}`;
    let city = getRandomElement(cities);
    let commune = city;
    let dtype = getRandomElement(dtypes);
    let phone = "+213" + Math.floor(600000000 + Math.random() * 400000000);
    let phone2 = "+213" + Math.floor(600000000 + Math.random() * 400000000);
    let insurance = Math.floor(Math.random() * 2);
    let statue = getRandomElement(statuses);
    let id = Math.floor(Math.random() * 100000);
    let exchange = Math.floor(Math.random() * 2);
    let address = `Street ${Math.floor(Math.random() * 100)}, ${city}`;
    let note = "";
    let from = "Blida";
    let declared = price;
    let date = new Date().toISOString().split("T")[0];
    orders.push(
      store,
      product,
      quantity,
      price,
      client,
      city,
      commune,
      dtype,
      phone,
      phone2,
      insurance,
      statue,
      id,
      exchange,
      address,
      note,
      from,
      declared,
      date
    );

    return orders;
  }

  //delete order
  const onDeleteOrder = (row) => {
    if (!row) return;
    axios
      .post(
        `${domain}/orders/deleterow/`,
        {
          sheetID: user.sheetID,
          rowNumber: row,
          //idk, i had to add newData bah l post tmchi
          newData: ["."],
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.noToken) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.data.deleted) {
          //update the ui
        } else {
          alert("Deletion failed");
        }
      });
  };

  //generate data
  const onGenerate = () => {
    let generatedValues = generateRandomOrders();
    console.log(orders);
    axios
      .post(
        `${domain}/orders/create/`,
        {
          sheetID: user.sheetID,
          values: generatedValues,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.noToken) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.data.generated) {
          setOrders((prev) => [...prev, generatedValues]);
        } else {
          window.location.reload();
        }
      });
  };

  return (
    <>
      <div className="container mx-auto p-6">
        {user.verified ? (
          <>
            {Object.keys(purchasedOffer).length !== 0 ? (
              <>
                <p className="text-lg font-semibold text-gray-800">
                  You have {purchasedOffer.title}
                </p>
                <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
                <OrdersTable
                  orders={orders}
                  setOrders={setOrders}
                  onGenerate={onGenerate}
                  onDeleteOrder={onDeleteOrder}
                  user={user}
                  domain={domain}
                />
              </>
            ) : (
              <p className="text-red-600 text-center mt-5">
                Your subscription has expired, please buy another one if you
                wish to use our features again
              </p>
            )}
          </>
        ) : (
          <p className="text-yellow-500 text-center mt-5">
            You need to verify your email. No Link? Re-send in settings.
          </p>
        )}
      </div>
    </>
  );
}

function OrdersTable({
  orders,
  setOrders,
  onGenerate,
  onDeleteOrder,
  user,
  domain,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <button
        className="mb-4 mr-4 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        onClick={onGenerate}
      >
        Generate
      </button>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        onClick={() => setCreating(true)}
      >
        + Create Order
      </button>

      {creating && (
        <OrderForm
          user={user}
          domain={domain}
          mode="create"
          initialValues={Array(19).fill("")}
          onSubmit={(newOrder) => {
            setOrders((prev) => [...prev, newOrder]);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}

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
          {orders.map((order, index) => (
            <React.Fragment key={index}>
              {/* EDIT FORM */}
              {editingIndex === index ? (
                <tr>
                  <td colSpan="9" className="border p-2">
                    <OrderForm
                      mode="edit"
                      index={index}
                      user={user}
                      domain={domain}
                      initialValues={editValues}
                      onSubmit={(updatedOrder) => {
                        setOrders((prev) =>
                          prev.map((o, i) => (i === index ? updatedOrder : o))
                        );
                        setEditingIndex(null);
                      }}
                      onCancel={() => setEditingIndex(null)}
                    />
                  </td>
                </tr>
              ) : (
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
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditValues(order); // Store the selected order
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          handleDelete(index);
                          onDeleteOrder(index + 1);
                        }}
                      >
                        Delete
                      </button>
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
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderForm({
  initialValues,
  onSubmit,
  onCancel,
  mode,
  index,
  user,
  domain,
}) {
  const [formValues, setFormValues] = useState(
    initialValues || Array(19).fill("")
  );
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // Set default values on mount (only for new orders)
  useEffect(() => {
    if (!initialValues) {
      setFormValues((prev) => {
        const updated = [...prev];
        updated[0] = "Foorweb";
        updated[18] = getCurrentDate(); // Set current date
        return updated;
      });
    } else {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (index, value) => {
    setFormValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const customOnSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (mode === "create") {
      axios
        .post(
          `${domain}/orders/create/`,
          {
            sheetID: user.sheetID,
            values: formValues,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.generated) {
            //update the ui
          } else {
            alert("Create order failed");
            window.location.reload();
          }
        });
    } else if (mode === "edit") {
      axios
        .post(
          `${domain}/orders/update/`,
          {
            sheetID: user.sheetID,
            rowNumber: index + 1,
            newData: formValues,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.updated) {
            //update ui
          } else {
            alert("Update failed");
            window.location.reload();
          }
        });
    }

    onSubmit(formValues);
  };

  return (
    <form
      onSubmit={customOnSubmit}
      className="flex flex-col gap-2 p-4 bg-gray-100 border rounded"
    >
      {/* Store (Read-Only) */}
      <input
        type="text"
        placeholder="Store"
        value={formValues[0]}
        disabled
        className="border p-2 bg-gray-200"
      />

      <input
        required
        type="text"
        placeholder="Product"
        value={formValues[1]}
        onChange={(e) => handleChange(1, e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={formValues[2]}
        onChange={(e) => handleChange(2, e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Price"
        value={formValues[3]}
        onChange={(e) => handleChange(3, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Client"
        value={formValues[4]}
        onChange={(e) => handleChange(4, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="City"
        value={formValues[5]}
        onChange={(e) => handleChange(5, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Commune"
        value={formValues[6]}
        onChange={(e) => handleChange(6, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Delivery Type"
        value={formValues[7]}
        onChange={(e) => handleChange(7, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formValues[8]}
        onChange={(e) => handleChange(8, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Phone 2"
        value={formValues[9]}
        onChange={(e) => handleChange(9, e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Insurance"
        value={formValues[10]}
        onChange={(e) => handleChange(10, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Status"
        value={formValues[11]}
        onChange={(e) => handleChange(11, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="ID"
        value={formValues[12]}
        onChange={(e) => handleChange(12, e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Exchange"
        value={formValues[13]}
        onChange={(e) => handleChange(13, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Address"
        value={formValues[14]}
        onChange={(e) => handleChange(14, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Note"
        value={formValues[15]}
        onChange={(e) => handleChange(15, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="From"
        value={formValues[16]}
        onChange={(e) => handleChange(16, e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Declared"
        value={formValues[17]}
        onChange={(e) => handleChange(17, e.target.value)}
        className="border p-2"
      />

      {/* Date (Read-Only) */}
      <input
        type="text"
        placeholder="Date"
        value={formValues[18]}
        disabled
        className="border p-2 bg-gray-200"
      />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-[0.3s]"
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded "
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
