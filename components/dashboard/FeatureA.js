import React, { useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Wilayas from "../../utils/wilayasData";

export default function FeatureA() {
  const { purchasedOffer, user, orders, setOrders, domain } = AuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const containerStyle = updating ? "pointer-events-none opacity-60" : "";

  const handleNoUser = () => {
    const msg = "Your session has expired. Please log in again.";
    router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
    localStorage.removeItem("accessToken");
  };

  function getRandomElement(arr) {
    return arr && arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRandomOrders() {
    const products = ["Shoes", "Pants", "T-Shirt"];
    const statuses = [
      "Confirmed",
      "Canceled",
      "Pending",
      "Onship",
      "Received",
      "Back",
    ];
    const dtypes = ["Domicile", "Stopdesk"];
    let orders = [];
    let product = getRandomElement(products);
    let dtype = getRandomElement(dtypes);
    let statue = getRandomElement(statuses);
    const cityObj = getRandomElement(Wilayas);
    let commune = getRandomElement(cityObj?.communes);
    let city = cityObj?.name;
    let quantity = Math.floor(Math.random() * 5) + 1;
    let price =
      Math.floor(Math.random() * ((10000 - 500) / 100 + 1)) * 100 + 500;
    let id = "";
    let note = "";
    let exchange = false;
    let client = `Client${Math.floor(Math.random() * 1000)}`;
    let phone =
      "0" +
      [5, 6, 7][Math.floor(Math.random() * 3)] +
      Math.floor(10000000 + Math.random() * 90000000);
    let phone2 =
      "0" +
      [5, 6, 7][Math.floor(Math.random() * 3)] +
      Math.floor(10000000 + Math.random() * 90000000);
    let address = `Street ${Math.floor(Math.random() * 100)}, ${city}`;
    let date = new Date().toISOString().split("T")[0];
    let store = "Store";
    let from = user?.city; //important for yalidine (ignore it for now)
    let declared = price; //important for yalidine (ignore it for now)
    let insurance = false; //important for yalidine (ignore it for now)
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
  const onDeleteOrder = async (row) => {
    if (!row) return;
    setUpdating(true);
    const routes = pathname.split("/");
    const currentPage = routes[routes.length - 1];
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
        currentPage: currentPage || "",
        offerId: offerId || "",
      },
    };
    try {
      const response = await axios.post(
        `${domain}/orders/delete/`,
        {
          sheetID: user?.sheetID,
          rowNumber: row,
        },
        config
      );
      //update the ui
      setOrders && setOrders((prev) => prev?.filter((_, i) => i !== row - 1));
      setUpdating(false);
      toast.success("Order deleted successfully.");
    } catch (err) {
      if (err?.response?.status === 401) {
        handleNoUser();
      } else if (err?.response?.status === 403) {
        toast.error("You are not subscribed to this feature.");
        router.push("no-access");
      } else {
        toast.error("An error occurred. Please try again.");
        setUpdating(false);
      }
    }
  };

  //generate data
  const onGenerate = async () => {
    let generatedValues = generateRandomOrders();
    setUpdating(true);
    const routes = pathname.split("/");
    const currentPage = routes[routes.length - 1];
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
        currentPage: currentPage || "",
        offerId: offerId || "",
      },
    };
    try {
      const response = await axios.post(
        `${domain}/orders/insert/`,
        {
          sheetID: user?.sheetID,
          values: generatedValues,
        },
        config
      );

      setOrders && setOrders((prev) => [...(prev || []), generatedValues]);
      toast.success("Order generated successfully.");
      setUpdating(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleNoUser();
      } else if (err?.response?.status === 400) {
        toast.error("Missing Data.");
        setUpdating(false);
      } else if (err?.response?.status === 403) {
        toast.error("You are not subscribed to this feature.");
        router.push("no-access");
      } else {
        toast.error("An error occurred. Please try again.");
        setUpdating(false);
      }
    }
  };

  return (
    <div className={`container mx-auto p-6 ${containerStyle}`}>
      <p className="text-lg font-semibold text-gray-800">
        You have {purchasedOffer?.title}
      </p>
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      <OrdersTable
        orders={orders}
        setOrders={setOrders}
        onGenerate={onGenerate}
        onDeleteOrder={onDeleteOrder}
        user={user}
        domain={domain}
        handleNoUser={handleNoUser}
        setUpdating={setUpdating}
        Wilayas={Wilayas}
      />
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
  setOrders,
  setCreating,
  setUpdating,
  setEditingIndex,
  handleNoUser,
  Wilayas,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [formValues, setFormValues] = useState(
    initialValues || Array(19).fill("")
  );
  const [selectedWilaya, setSelectedWilaya] = useState(
    formValues?.[5] ? formValues[5] : ""
  );

  const statuses = [
    "Non Confirmed",
    "Confirmed",
    "Canceled",
    "Pending",
    "Onship",
    "Received",
    "Back",
  ];
  const deliveryTypes = ["Domicile", "Stopdesk"];

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // communes for the currently selected wilaya
  const communes = useMemo(() => {
    const w = Wilayas?.find((w) => w.name === selectedWilaya);
    return w?.communes || [];
  }, [Wilayas, selectedWilaya]);

  // Set initial values when the component mounts or when initialValues change
  useEffect(() => {
    // If initialValues is not provided, set default values
    if (!initialValues) {
      setFormValues((prev) => {
        const updated = [...(prev || [])];
        updated[0] = "Store";
        updated[18] = getCurrentDate(); // Set current date
        return updated;
      });
    } else {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (idx, value) => {
    setFormValues((prev) => {
      const updated = [...(prev || [])];
      updated[idx] = value;
      return updated;
    });
  };

  const customOnSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setUpdating(true);
    const routes = pathname.split("/");
    const currentPage = routes[routes.length - 1];
    const offerId = user?.purchasedOffer?.offer;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
        currentPage: currentPage || "",
        offerId: offerId || "",
      },
    };
    if (mode === "insert") {
      try {
        const response = await axios.post(
          `${domain}/orders/insert/`,
          {
            sheetID: user?.sheetID,
            values: formValues,
          },
          config
        );
        // update the UI
        setOrders && setOrders((prev) => [...(prev || []), formValues]);
        toast.success("Order inserted successfully.");
        setCreating(false);
        setUpdating(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleNoUser();
        } else if (err?.response?.status === 400) {
          toast.error("Missing Data.");
          setUpdating(false);
        } else if (err?.response?.status === 403) {
          toast.error("You are not subscribed to this feature.");
          router.push("no-access");
        } else {
          toast.error("An error occurred. Please try again.");
          setUpdating(false);
        }
      }
    } else if (mode === "edit") {
      try {
        const response = await axios.post(
          `${domain}/orders/update/`,
          {
            sheetID: user?.sheetID,
            rowNumber: index + 1,
            newData: formValues,
          },
          config
        );
        // update the UI
        setOrders &&
          setOrders((prev) =>
            prev?.map((order, i) => (i === index ? formValues : order))
          );
        toast.success("Order updated successfully.");
        setEditingIndex && setEditingIndex(null);
        setUpdating(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleNoUser();
        } else if (err?.response?.status === 400) {
          toast.error("Missing Data.");
          setUpdating(false);
        } else if (err?.response?.status === 403) {
          toast.error("You are not subscribed to this feature.");
          router.push("no-access");
        } else {
          toast.error("An error occurred. Please try again.");
          setUpdating(false);
        }
      }
    }
    onSubmit && onSubmit(formValues);
  };

  return (
    <form
      onSubmit={customOnSubmit}
      className="flex flex-col gap-2 p-4 bg-gray-100 border rounded"
    >
      <input
        required
        type="text"
        placeholder="Product"
        value={formValues?.[1]}
        onChange={(e) => handleChange(1, e.target.value)}
        className="border p-2"
        maxLength={50}
      />

      <input
        required
        type="number"
        placeholder="Quantity"
        value={formValues?.[2]}
        onChange={(e) => handleChange(2, e.target.value)}
        className="border p-2"
        min={1}
        max={1000}
      />

      <input
        required
        type="number"
        placeholder="Price"
        value={formValues?.[3]}
        onChange={(e) => handleChange(3, e.target.value)}
        className="border p-2"
        step={100}
        min={300}
        max={10000}
      />

      <input
        required
        type="text"
        placeholder="Client"
        value={formValues?.[4]}
        onChange={(e) => handleChange(4, e.target.value)}
        className="border p-2"
        maxLength={30}
      />

      {/* --- Wilaya (city) --- */}
      <select
        className="border p-2 w-full"
        required
        value={formValues?.[5] || ""}
        onChange={(e) => {
          const name = e.target.value;
          setSelectedWilaya(name);
          handleChange(5, name); // store wilaya id
          handleChange(6, ""); // reset commune when wilaya changes
        }}
      >
        <option value="">-- Choisissez la wilaya --</option>
        {Wilayas?.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* --- Commune --- */}
      <select
        className="border p-2 w-full"
        required
        value={formValues?.[6] || ""}
        onChange={(e) => handleChange(6, e.target.value)}
        disabled={!communes.length}
      >
        <option value="">
          {communes.length
            ? "-- Choisissez la commune --"
            : "Choisissez d’abord une wilaya"}
        </option>
        {communes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Delivery Type (select) */}
      <select
        value={formValues?.[7]}
        onChange={(e) => handleChange(7, e.target.value)}
        className="border p-2"
        required
      >
        <option value="">Select Delivery Type</option>
        {deliveryTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Phone */}
      <input
        type="text"
        placeholder="Phone"
        value={formValues?.[8]}
        onChange={(e) => handleChange(8, e.target.value)}
        className="border p-2"
        pattern="0[5-7][0-9]{8}"
        title="Must start with 05/06/07 and be followed by 8 digits"
        required
      />

      {/* Phone 2 */}
      <input
        type="text"
        placeholder="Phone 2"
        value={formValues?.[9]}
        onChange={(e) => handleChange(9, e.target.value)}
        className="border p-2"
        pattern="0[5-7][0-9]{8}"
        title="Must start with 05/06/07 and be followed by 8 digits"
      />

      {/* Status */}
      <select
        value={formValues?.[11]}
        onChange={(e) => handleChange(11, e.target.value)}
        className="border p-2"
        required
      >
        <option value="">Select Status</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Exchange (checkbox) */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formValues?.[13] === true || formValues?.[13] === "true"}
          onChange={(e) => handleChange(13, e.target.checked)}
        />
        Exchange
      </label>

      <input
        required
        type="text"
        placeholder="Address"
        value={formValues?.[14]}
        onChange={(e) => handleChange(14, e.target.value)}
        className="border p-2"
        maxLength={100}
      />

      <input
        type="text"
        placeholder="Note"
        value={formValues?.[15]}
        onChange={(e) => handleChange(15, e.target.value)}
        className="border p-2"
        maxLength={100}
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-[0.3s]"
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function OrdersTable({
  orders,
  setOrders,
  onGenerate,
  onDeleteOrder,
  user,
  domain,
  handleNoUser,
  setUpdating,
  Wilayas,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [creating, setCreating] = useState(false);
  const [quantitySort, setQuantitySort] = useState(null);
  const [priceSort, setPriceSort] = useState(null);
  const [citySort, setCitySort] = useState(null);
  const [deliverySort, setDeliverySort] = useState(null);
  const [statusSort, setStatusSort] = useState(null);

  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = useState(1);
  const ORDERS_PER_PAGE = 14;

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set((orders || []).map((o) => o?.[5]).filter(Boolean))
      ).sort(),
    [orders]
  );
  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set((orders || []).map((o) => o?.[11]).filter(Boolean))
      ).sort(),
    [orders]
  );
  const deliveryOptions = useMemo(
    () =>
      Array.from(
        new Set((orders || []).map((o) => o?.[7]).filter(Boolean))
      ).sort(),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      let pass = true;
      if (cityFilter) pass = pass && order?.[5] === cityFilter;
      if (statusFilter) pass = pass && order?.[11] === statusFilter;
      if (deliveryFilter) pass = pass && order?.[7] === deliveryFilter;
      return pass;
    });
  }, [orders, cityFilter, statusFilter, deliveryFilter]);

  const sortedOrders = useMemo(() => {
    let sorted = [...filteredOrders];
    if (quantitySort) {
      sorted.sort((a, b) => {
        const qA = Number(a?.[2]) || 0;
        const qB = Number(b?.[2]) || 0;
        if (quantitySort === "asc") return qA - qB;
        if (quantitySort === "desc") return qB - qA;
        return 0;
      });
    } else if (priceSort) {
      sorted.sort((a, b) => {
        const pA = Number(a?.[3]) || 0;
        const pB = Number(b?.[3]) || 0;
        if (priceSort === "asc") return pA - pB;
        if (priceSort === "desc") return pB - pA;
        return 0;
      });
    } else if (citySort) {
      sorted.sort((a, b) => {
        const cA = (a?.[5] || "").toLowerCase();
        const cB = (b?.[5] || "").toLowerCase();
        if (citySort === "asc") return cA.localeCompare(cB);
        if (citySort === "desc") return cB.localeCompare(cA);
        return 0;
      });
    } else if (deliverySort) {
      sorted.sort((a, b) => {
        const dA = (a?.[7] || "").toLowerCase();
        const dB = (b?.[7] || "").toLowerCase();
        if (deliverySort === "asc") return dA.localeCompare(dB);
        if (deliverySort === "desc") return dB.localeCompare(dA);
        return 0;
      });
    } else if (statusSort) {
      sorted.sort((a, b) => {
        const sA = (a?.[11] || "").toLowerCase();
        const sB = (b?.[11] || "").toLowerCase();
        if (statusSort === "asc") return sA.localeCompare(sB);
        if (statusSort === "desc") return sB.localeCompare(sA);
        return 0;
      });
    }
    return sorted;
  }, [
    filteredOrders,
    quantitySort,
    priceSort,
    citySort,
    deliverySort,
    statusSort,
  ]);

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ORDERS_PER_PAGE;
    return sortedOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [sortedOrders, page]);

  const handleQuantitySort = () => {
    setQuantitySort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setPriceSort(null);
    setCitySort(null);
    setDeliverySort(null);
    setStatusSort(null);
  };
  const handlePriceSort = () => {
    setPriceSort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setQuantitySort(null);
    setCitySort(null);
    setDeliverySort(null);
    setStatusSort(null);
  };
  const handleCitySort = () => {
    setCitySort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setQuantitySort(null);
    setPriceSort(null);
    setDeliverySort(null);
    setStatusSort(null);
  };
  const handleDeliverySort = () => {
    setDeliverySort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setQuantitySort(null);
    setPriceSort(null);
    setCitySort(null);
    setStatusSort(null);
  };
  const handleStatusSort = () => {
    setStatusSort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setQuantitySort(null);
    setPriceSort(null);
    setCitySort(null);
    setDeliverySort(null);
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const allIndexes = paginatedOrders.map((order) => {
        return orders.findIndex(
          (o) =>
            o === order ||
            (o?.[1] === order?.[1] &&
              o?.[2] === order?.[2] &&
              o?.[3] === order?.[3] &&
              o?.[4] === order?.[4] &&
              o?.[5] === order?.[5])
        );
      });
      setSelectedRows(allIndexes);
      setSelectAll(true);
    }
  };

  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [
    orders,
    cityFilter,
    statusFilter,
    deliveryFilter,
    quantitySort,
    priceSort,
    citySort,
    deliverySort,
    statusSort,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    cityFilter,
    statusFilter,
    deliveryFilter,
    quantitySort,
    priceSort,
    citySort,
    deliverySort,
    statusSort,
  ]);

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;
    if (!window.confirm(`Delete ${selectedRows.length} selected orders?`))
      return;
    setUpdating(true);
    try {
      for (const idx of selectedRows) {
        await onDeleteOrder(idx + 1);
      }
      setSelectedRows([]);
      setSelectAll(false);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="p-1">
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded text-base"
          onClick={onGenerate}
        >
          Generate
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded text-base"
          onClick={() => setCreating(true)}
        >
          + Create Order
        </button>
        <span className="text-sm text-gray-700">{`You have: ${
          orders?.length || 0
        } order`}</span>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded text-base ml-2"
          onClick={handleQuantitySort}
        >
          {quantitySort === "asc"
            ? "Qty ↑"
            : quantitySort === "desc"
            ? "Qty ↓"
            : "Sort Qty"}
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded text-base"
          onClick={handlePriceSort}
        >
          {priceSort === "asc"
            ? "Price ↑"
            : priceSort === "desc"
            ? "Price ↓"
            : "Sort Price"}
        </button>
        <select
          className="border p-1 text-base rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          className="border p-1 text-base rounded"
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
        >
          <option value="">All Delivery</option>
          {deliveryOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          className="border p-1 text-base rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className={`px-3 py-1 bg-red-500 text-white rounded text-base ml-2 ${
            selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-base"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="text-base">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-base"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {creating ? (
        <OrderForm
          user={user}
          domain={domain}
          mode="insert"
          setOrders={setOrders}
          setCreating={setCreating}
          handleNoUser={handleNoUser}
          setUpdating={setUpdating}
          initialValues={Array(19).fill("")}
          onSubmit={() => {}}
          onCancel={() => setCreating(false)}
          Wilayas={Wilayas}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    aria-label="Select all orders"
                  />
                </th>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">
                  Qty
                  <button
                    className="ml-1 text-blue-600 underline text-base"
                    onClick={handleQuantitySort}
                    title="Sort by Quantity"
                  >
                    {quantitySort === "asc"
                      ? "↑"
                      : quantitySort === "desc"
                      ? "↓"
                      : "↕"}
                  </button>
                </th>
                <th className="border px-2 py-1">
                  Price
                  <button
                    className="ml-1 text-blue-600 underline text-base"
                    onClick={handlePriceSort}
                    title="Sort by Price"
                  >
                    {priceSort === "asc"
                      ? "↑"
                      : priceSort === "desc"
                      ? "↓"
                      : "↕"}
                  </button>
                </th>
                <th className="border px-2 py-1">Client</th>
                <th className="border px-2 py-1">
                  City
                  <button
                    className="ml-1 text-blue-600 underline text-base"
                    onClick={handleCitySort}
                    title="Sort by City"
                  >
                    {citySort === "asc" ? "↑" : citySort === "desc" ? "↓" : "↕"}
                  </button>
                </th>
                <th className="border px-2 py-1">
                  Delivery
                  <button
                    className="ml-1 text-blue-600 underline text-base"
                    onClick={handleDeliverySort}
                    title="Sort by Delivery"
                  >
                    {deliverySort === "asc"
                      ? "↑"
                      : deliverySort === "desc"
                      ? "↓"
                      : "↕"}
                  </button>
                </th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">Note</th>
                <th className="border px-2 py-1">
                  Status
                  <button
                    className="ml-1 text-blue-600 underline text-base"
                    onClick={handleStatusSort}
                    title="Sort by Status"
                  >
                    {statusSort === "asc"
                      ? "↑"
                      : statusSort === "desc"
                      ? "↓"
                      : "↕"}
                  </button>
                </th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders?.map((order, index) => {
                const originalIndex =
                  (quantitySort ||
                    priceSort ||
                    citySort ||
                    deliverySort ||
                    statusSort ||
                    cityFilter ||
                    statusFilter ||
                    deliveryFilter) &&
                  orders
                    ? orders.findIndex(
                        (o) =>
                          o === order ||
                          (o?.[1] === order?.[1] &&
                            o?.[2] === order?.[2] &&
                            o?.[3] === order?.[3] &&
                            o?.[4] === order?.[4] &&
                            o?.[5] === order?.[5])
                      )
                    : (page - 1) * ORDERS_PER_PAGE + index;
                return (
                  <React.Fragment key={index}>
                    {editingIndex === originalIndex ? (
                      <tr>
                        <td colSpan="11" className="border px-2 py-1">
                          <OrderForm
                            mode="edit"
                            index={originalIndex}
                            user={user}
                            domain={domain}
                            setOrders={setOrders}
                            setEditingIndex={setEditingIndex}
                            handleNoUser={handleNoUser}
                            setUpdating={setUpdating}
                            initialValues={order}
                            onSubmit={() => {}}
                            onCancel={() => setEditingIndex(null)}
                            Wilayas={Wilayas}
                          />
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr className="border">
                          <td className="border px-2 py-1">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(originalIndex)}
                              onChange={() => handleSelectRow(originalIndex)}
                              aria-label={`Select order ${originalIndex + 1}`}
                            />
                          </td>
                          <td className="border px-2 py-1">{order?.[1]}</td>
                          <td className="border px-2 py-1">{order?.[2]}</td>
                          <td className="border px-2 py-1">{order?.[3]}</td>
                          <td className="border px-2 py-1">{order?.[4]}</td>
                          <td className="border px-2 py-1">
                            {order?.[5] || ""}
                          </td>
                          <td className="border px-2 py-1">{order?.[7]}</td>
                          <td className="border px-2 py-1">{order?.[8]}</td>
                          <td className="border px-2 py-1 w-[100px] max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                            {order?.[15]}
                          </td>
                          <td className="border px-2 py-1">{order?.[11]}</td>
                          <td className="border px-2 py-1">
                            <div className="flex flex-row justify-around items-center gap-1 ">
                              <button
                                className="px-1 py-0.5 bg-blue-500 text-white rounded text-base cursor-pointer"
                                onClick={() => {
                                  setEditingIndex(originalIndex);
                                  setEditValues(order);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="px-1 py-0.5 bg-red-500 text-white rounded text-base cursor-pointer"
                                onClick={() => {
                                  onDeleteOrder(originalIndex + 1);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="px-1 py-0.5 bg-gray-500 text-white rounded text-base cursor-pointer"
                                onClick={() =>
                                  setExpandedRow(
                                    expandedRow === index ? null : index
                                  )
                                }
                              >
                                {expandedRow === index ? "Hide" : "More"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === index && (
                          <tr>
                            <td
                              colSpan="11"
                              className="border px-2 py-1 bg-gray-100 text-base"
                            >
                              <div className="flex flex-wrap gap-2">
                                <span>
                                  <strong>Commune:</strong> {order?.[6]}
                                </span>
                                <span>
                                  <strong>Delivery Type:</strong> {order?.[7]}
                                </span>
                                <span>
                                  <strong>Phone:</strong> {order?.[8]}
                                </span>
                                <span>
                                  <strong>Phone2:</strong> {order?.[9]}
                                </span>
                                <span>
                                  <strong>Address:</strong> {order?.[14]}
                                </span>
                                <span>
                                  <strong>Note:</strong> {order?.[15]}
                                </span>
                                <span>
                                  <strong>Status:</strong> {order?.[11]}
                                </span>
                                <span>
                                  <strong>Exchange:</strong>{" "}
                                  {order?.[13] === true ? "Yes" : "No"}
                                </span>
                                <span>
                                  <strong>ID:</strong> {order?.[12]}
                                </span>
                                <span>
                                  <strong>Date:</strong> {order?.[18]}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-base"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="text-base">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-base"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
