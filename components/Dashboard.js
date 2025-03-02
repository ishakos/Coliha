import { AuthContext } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Dashboard() {
  const { purchasedOffer, user, orders, setOrders, domain } = AuthContext();

  const [sendingRequest, setSendingRequest] = useState(false);
  const [disable, setDisable] = useState(false);

  const containerStyles = {
    opacity: sendingRequest ? 0.6 : 1,
    pointerEvents: sendingRequest ? "none" : "auto",
  };
  const disableStyles = {
    opacity: disable ? 0.6 : 1,
    pointerEvents: disable ? "none" : "auto",
  };

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRandomOrders() {
    const stores = ["Shopify", "Foorweb"];
    const products = ["Shoes", "Pants", "T-Shirt"];
    const statuses = ["Confirmed", "Canceled", "Non Confirmed", "Onship"];
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
    //setSendingRequest(true);
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
          window.location.reload();
        } else {
          window.location.reload();
        }
        //setSendingRequest(false);
      });
  };

  const onSubmit = (data) => {
    const newData = Object.values(data);
    const row = newData.pop();
    setSendingRequest(true);
    axios
      .post(
        `${domain}/orders/update/`,
        {
          sheetID: user.sheetID,
          rowNumber: row,
          newData: newData,
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
          window.location.reload();
        } else {
          window.location.reload();
        }
        //setSendingRequest(false);
        //setDisable(false);
      });
  };

  //generate data
  const onGenerate = () => {
    setSendingRequest(true);
    let generatedValues = generateRandomOrders();
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
        setSendingRequest(false);
      });
  };

  return (
    <div className="dashboard-page">
      {user.verified ? (
        <>
          {Object.keys(purchasedOffer).length !== 0 ? (
            <DashboardMain
              purchasedOffer={purchasedOffer}
              user={user}
              orders={orders}
              containerStyles={containerStyles}
              disableStyles={disableStyles}
              onDeleteOrder={onDeleteOrder}
              onSubmit={onSubmit}
              onGenerate={onGenerate}
              setDisable={setDisable}
              setOrders={setOrders}
              setSendingRequest={setSendingRequest}
              domain={domain}
            />
          ) : (
            <p>
              Your subscription has expired, please buy another one if you wish
              to use our features again
            </p>
          )}
        </>
      ) : (
        <p>You need to verifiy your email, no Link? re-send in settings</p>
      )}
    </div>
  );
}

function DashboardMain({
  purchasedOffer,
  user,
  orders,
  containerStyles,
  disableStyles,
  onDeleteOrder,
  onSubmit,
  onGenerate,
  setDisable,
  setOrders,
  setSendingRequest,
  domain,
}) {
  const expirationDate = new Date(user.purchasedOffer.EndsAt);
  const [create, setCreate] = useState(false);
  //create data
  const onCreateProduct = (data) => {
    setSendingRequest(true);
    const newData = Object.values(data);
    const row = newData.pop();
    const date = newData.pop();
    let currentDate = new Date();
    let isoString = currentDate.toISOString();
    let formattedDate = isoString.split("T")[0];
    newData.push(formattedDate);
    axios
      .post(
        `${domain}/orders/create/`,
        {
          sheetID: user.sheetID,
          values: newData,
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
          setOrders((prev) => [...prev, newData]);
        } else {
          window.location.reload();
        }
        setCreate(false);
        setSendingRequest(false);
      });
  };
  return (
    <>
      <p>i have {purchasedOffer.title}</p>{" "}
      <p>{`Your ${
        purchasedOffer.title
      } will be expired on: ${expirationDate.toLocaleString()}`}</p>
      <div>
        <button
          onClick={() => {
            setCreate((create) => !create);
          }}
        >
          Create Order
        </button>
        <button onClick={onGenerate}>Generate</button>
        <h1>Orders</h1>
        {create ? (
          <div style={containerStyles}>
            <OrderForm
              orders={[]}
              order={[]}
              row={""}
              user={""}
              setEdit={() => {}}
              onSubmit={onCreateProduct}
              setDisable={() => {}}
              containerStyles={{}}
            ></OrderForm>
            <button
              type="button"
              onClick={() => {
                setCreate(false);
                setDisable(false);
              }}
            >
              Cancel Edit
            </button>
          </div>
        ) : (
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
            {orders?.map((order, index) => {
              return (
                <Order
                  key={index + 1}
                  row={index + 1}
                  orders={orders}
                  order={order}
                  onDeleteOrder={onDeleteOrder}
                  containerStyles={containerStyles}
                  disableStyles={disableStyles}
                  onSubmit={onSubmit}
                  user={user}
                  setDisable={setDisable}
                />
              );
            })}
          </table>
        )}
      </div>
    </>
  );
}

function Order({
  orders,
  order,
  onDeleteOrder,
  row,
  containerStyles,
  disableStyles,
  user,
  setDisable,
  onSubmit,
}) {
  const [edit, setEdit] = useState(false);
  return edit ? (
    <tbody className="order-edit-form" style={containerStyles}>
      <tr>
        <td>
          <OrderForm
            orders={orders}
            order={order}
            row={row}
            user={user}
            setEdit={setEdit}
            onSubmit={onSubmit}
            setDisable={setDisable}
          />
          <button
            type="button"
            onClick={() => {
              setEdit(false);
              setDisable(false);
            }}
          >
            Cancel Edit
          </button>
        </td>
      </tr>
    </tbody>
  ) : (
    <>
      <tbody style={{ ...containerStyles, ...disableStyles }}>
        <tr>
          {order?.map((column, i) => (
            <td key={i}>{column}</td>
          ))}
          <td key={-1}>
            <button
              onClick={() => {
                setEdit((edit) => !edit);
                setDisable(true);
              }}
            >
              Edit
            </button>
            <DeleteOrderButton onDeleteOrder={onDeleteOrder} row={row} />
          </td>
        </tr>
      </tbody>
    </>
  );
}

function OrderForm({ order, row, user, setEdit, setDisable, onSubmit }) {
  const [store, setStore] = useState(order[0] || "");
  const [product, setProduct] = useState(order[1] || "");
  const [quantity, setQuantity] = useState(order[2] || "");
  const [price, setPrice] = useState(order[3] || "");
  const [client, setClient] = useState(order[4] || "");
  const [city, setCity] = useState(order[5] || "");
  const [commune, setCommune] = useState(order[6] || "");
  const [dtype, setDtype] = useState(order[7] || "");
  const [phone, setPhone] = useState(order[8] || "");
  const [phone2, setPhone2] = useState(order[9] || "");
  const [insurance, setInsurance] = useState(order[10] || "");
  const [statue, setStatue] = useState(order[11] || "");
  const [id, setId] = useState(order[12] || "");
  const [exchange, setExchange] = useState(order[13] || "");
  const [address, setAddress] = useState(order[14] || "");
  const [note, setNote] = useState(order[15] || "");
  const [from, setFrom] = useState(user.city || "");
  const [declared, setDeclared] = useState(order[17] || "");
  const [date, setDate] = useState(order[18] || "");

  const initialValues = {
    store: store,
    product: product,
    quantity: quantity,
    price: price,
    client: client,
    city: city,
    commune: commune,
    dtype: dtype,
    phone: phone,
    phone2: phone2,
    insurance: insurance,
    statue: statue,
    id: id,
    exchange: exchange,
    address: address,
    note: note,
    from: from,
    declared: declared,
    date: date,
    row: row,
  };

  const validationSchema = Yup.object().shape({
    product: Yup.string().required("Product is required"),
    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .integer("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(15, "Quantity cannot exceed 15")
      .required("Quantity is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .integer("Price must be a whole number")
      .min(400, "Price must be at least 400")
      .required("Price is required"),
    client: Yup.string().required("Client name is required").min(3).max(30),
    city: Yup.string()
      .oneOf([
        "Algiers",
        "Oran",
        "Constantine",
        "Annaba",
        "Batna",
        "Blida",
        "Tlemcen",
        "Bejaia",
        "Setif",
        "Biskra",
        "Tiaret",
        "Djelfa",
        "Mostaganem",
        "Skikda",
        "Tizi Ouzou",
        "Medea",
        "Sidi Bel Abbes",
        "El Oued",
        "Ghardaia",
        "Ain Defla",
        "Relizane",
        "Tamanrasset",
        "Mascara",
        "Khenchela",
        "Jijel",
        "Ouargla",
        "Saida",
        "Laghouat",
        "Msila",
        "Bouira",
        "Naama",
        "Adrar",
        "Illizi",
        "El Bayadh",
        "Boumerdes",
        "Tindouf",
        "Ain Temouchent",
        "Guelma",
        "Tissemsilt",
        "Souk Ahras",
        "Tipaza",
        "Bordj Bou Arreridj",
        "El Tarf",
        "Ain Oussera",
        "Tebessa",
        "Mila",
        "Oum El Bouaghi",
        "El M'ghair",
        "El Menia",
        "Touggourt",
        "Beni Abbes",
        "Timimoun",
        "Djanet",
        "In Salah",
        "In Guezzam",
      ])
      .required("Invalid City"),
    commune: Yup.string()
      .oneOf([
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
      ])
      .required("Invalid Commune"),
    dtype: Yup.string()
      .oneOf(["Stopdesk", "Domicile"], "Invalid delivery type")
      .required("Delivery type is required"),
    phone: Yup.string()
      .matches(
        /^\+213\d{9}$/, // +213 followed by exactly 9 digits
        "Phone number must be in +213XXXXXXXXX format"
      )
      .required("Phone number is required"),
    phone2: Yup.string()
      .matches(
        /^\+213\d{9}$/, // +213 followed by exactly 9 digits
        "Phone number must be in +213XXXXXXXXX format"
      )
      .required("Phone number is required"),
    insurance: Yup.string()
      .oneOf(["1", "0"], "Insurance must be 1 or 0")
      .required("Insurance is required"),
    statue: Yup.string()
      .oneOf(
        ["Confirmed", "Non Confirmed", "Canceled", "Onship"],
        "Invalid status"
      )
      .required("Status is required"),
    exchange: Yup.string()
      .oneOf(["1", "0"], "Exchange must be 1 or 0")
      .required("Exchange is required"),
    address: Yup.string().required("Address is required").min(3).max(30),
    from: Yup.string()
      .oneOf([
        "Algiers",
        "Oran",
        "Constantine",
        "Annaba",
        "Batna",
        "Blida",
        "Tlemcen",
        "Bejaia",
        "Setif",
        "Biskra",
        "Tiaret",
        "Djelfa",
        "Mostaganem",
        "Skikda",
        "Tizi Ouzou",
        "Medea",
        "Sidi Bel Abbes",
        "El Oued",
        "Ghardaia",
        "Ain Defla",
        "Relizane",
        "Tamanrasset",
        "Mascara",
        "Khenchela",
        "Jijel",
        "Ouargla",
        "Saida",
        "Laghouat",
        "Msila",
        "Bouira",
        "Naama",
        "Adrar",
        "Illizi",
        "El Bayadh",
        "Boumerdes",
        "Tindouf",
        "Ain Temouchent",
        "Guelma",
        "Tissemsilt",
        "Souk Ahras",
        "Tipaza",
        "Bordj Bou Arreridj",
        "El Tarf",
        "Ain Oussera",
        "Tebessa",
        "Mila",
        "Oum El Bouaghi",
        "El M'ghair",
        "El Menia",
        "Touggourt",
        "Beni Abbes",
        "Timimoun",
        "Djanet",
        "In Salah",
        "In Guezzam",
      ])
      .required("Invalid City"),
    declared: Yup.string()
      .matches(/^\d+$/, "Declared amount must be a positive number") // Only digits
      .required("Declared amount is required")
      .min(1, "Declared amount must be positive"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form>
          <Input type={"store"} value={store} set={setStore} disabled={true} />
          <Input
            type={"product"}
            value={product}
            set={setProduct}
            formik={formik}
          />
          <Input
            type={"quantity"}
            value={quantity}
            set={setQuantity}
            formik={formik}
          />
          <Input type={"price"} value={price} set={setPrice} formik={formik} />
          <Input
            type={"client"}
            value={client}
            set={setClient}
            formik={formik}
          />
          <Input type={"city"} value={city} set={setCity} formik={formik} />
          <Input
            type={"commune"}
            value={commune}
            set={setCommune}
            formik={formik}
          />
          <Input type={"dtype"} value={dtype} set={setDtype} formik={formik} />
          <Input type={"phone"} value={phone} set={setPhone} formik={formik} />
          <Input
            type={"phone2"}
            value={phone2}
            set={setPhone2}
            formik={formik}
          />
          <Input
            type={"insurance"}
            value={insurance}
            set={setInsurance}
            formik={formik}
          />
          <Input
            type={"statue"}
            value={statue}
            set={setStatue}
            formik={formik}
          />
          <Input type={"id"} value={id} set={setId} formik={formik} />
          <Input
            type={"exchange"}
            value={exchange}
            set={setExchange}
            formik={formik}
          />
          <Input
            type={"address"}
            value={address}
            set={setAddress}
            formik={formik}
          />
          <Input type={"note"} value={note} set={setNote} formik={formik} />
          <Input type={"from"} value={from} set={setFrom} formik={formik} />
          <Input
            type={"declared"}
            value={declared}
            set={setDeclared}
            formik={formik}
          />
          <Input
            type={"date"}
            value={date}
            set={setDate}
            disabled={true}
            formik={formik}
          />
          <button type="submit">Save</button>
        </Form>
      )}
    </Formik>
  );
}

function Input({ type, value, set, disabled, formik }) {
  return (
    <div className="login-form">
      <ErrorMessage name={type} component="span" />
      <Field
        disabled={disabled}
        autoComplete="off"
        id={`unique-${type}`}
        placeholder={`Put your ${type}...`}
        type={`${type}`}
        value={`${value}`}
        name={`${type}`}
        onChange={(event) => {
          formik.handleChange(event);
          set(event.target.value);
        }}
      />
    </div>
  );
}

function DeleteOrderButton({ onDeleteOrder, row }) {
  const [deleteOrder, setDeleteOrder] = useState(false);
  return (
    <>
      {deleteOrder ? (
        <>
          <button onClick={() => setDeleteOrder((deleteOrder) => !deleteOrder)}>
            Cancel Delete
          </button>
          <button
            onClick={() => {
              onDeleteOrder(row);
            }}
          >
            Confirm Delete
          </button>
        </>
      ) : (
        <button onClick={() => setDeleteOrder(() => true)}>Delete Order</button>
      )}
    </>
  );
}
