import { useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Wilayas from "@/utils/wilayasData";

export default function Register() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(true);
  const { domain } = AuthContext();
  const router = useRouter();

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${domain}/users/essential`);
        setListOfUsers(response?.data?.users || []);
      } catch {
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchData();
  }, [domain, router]);

  if (loadingFetch) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading hold on...</p>
      </div>
    );
  }

  const cities = Wilayas?.map((w) => w?.name)?.sort() || [];

  const initialValues = {
    username: "",
    email: "",
    password: "",
    city: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Must be at least 3 characters")
      .max(15, "Must be 15 characters or less")
      .test({
        name: "unique-username",
        message: "Username already exists",
        test: (value) => !listOfUsers?.some((user) => user?.username === value),
      })
      .matches(/^\S*$/, "Username should not contain spaces"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .test({
        name: "unique-email",
        message: "Email already exists",
        test: (value) => !listOfUsers?.some((user) => user?.email === value),
      }),
    password: Yup.string()
      .required("Password is required")
      .min(3, "Must be at least 3 characters")
      .max(20, "Must be 20 characters or less"),
    city: Yup.string()
      .required("City is required")
      .oneOf(cities, "Invalid city"),
  });

  const onSubmit = async (data) => {
    setSending(true);
    try {
      const response = await axios.post(`${domain}/users/register`, data);
      setSent(true);
    } catch (error) {
      if (error?.response && error?.response?.status === 409) {
        setError(
          error?.response?.data?.message || "Username or Email already exists."
        );
      } else {
        setError("Registration failed, please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  // Reset error when any field is focused
  const handleFieldFocus = () => {
    if (error) setError("");
  };

  return (
    <>
      {sent ? (
        <Registered />
      ) : (
        <div
          className={`min-h-screen flex items-start pt-25 justify-center bg-gray-900 text-white px-4 ${
            sending ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="max-w-3xl w-full bg-gray-800 p-16 rounded-2xl shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8">
              Create an Account
            </h2>
            {error && (
              <p className="text-red-400 mb-6 text-lg text-center">{error}</p>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              validateOnChange={false}
            >
              <Form className="space-y-8">
                <Input
                  type="username"
                  label="Username"
                  onFocus={handleFieldFocus}
                />
                <Input type="email" label="Email" onFocus={handleFieldFocus} />
                <Input
                  type="password"
                  label="Password"
                  onFocus={handleFieldFocus}
                />
                <CitySelect cities={cities} onFocus={handleFieldFocus} />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg transition cursor-pointer"
                >
                  REGISTER
                </button>
              </Form>
            </Formik>
            <p className="text-center text-base mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Input({ type, label, onFocus }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <ErrorMessage
        name={type}
        component="p"
        className="text-red-500 text-sm mt-1 mb-1
        "
      />
      <Field
        autoComplete="off"
        id={"unique-" + type}
        name={type}
        type={type}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onFocus={onFocus}
      />
    </div>
  );
}

function CitySelect({ cities, onFocus }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">City</label>
      <ErrorMessage
        name="city"
        component="p"
        className="text-red-500 text-sm mt-1"
      />
      <Field
        as="select"
        name="city"
        id="unique-city"
        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onFocus={onFocus}
      >
        <option value="">Select your city</option>
        {cities?.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Field>
    </div>
  );
}

function Registered() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center bg-gray-800 p-6 rounded-xl shadow-lg">
        <p className="mb-4">
          ✅ Verify your email, otherwise your account will be deleted after one
          month.
        </p>
        <p className="mb-4 text-sm text-gray-400">
          If you cant find the verification email, you can request another one
          in the settings.
        </p>
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Go To Login
        </Link>
      </div>
    </div>
  );
}
