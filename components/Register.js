import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [sent, setSent] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const { domain } = AuthContext(); // ✅ FIXED useContext
  const router = useRouter();

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${domain}/users/essential`);
        setListOfUsers(response.data.users);
      } catch (error) {
        router.push("/unwanted-page");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchData();
  }, [domain, router]);

  if (loadingFetch) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading users...</p>
      </div>
    );
  }

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Must be at least 3 characters")
      .max(15, "Must be 15 characters or less")
      .test({
        name: "unique-username",
        message: "Username already exists",
        test: (value) => !listOfUsers.some((user) => user?.username === value), // ✅ FIXED LOGIC
      })
      .matches(/^\S*$/, "Username should not contain spaces"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .test({
        name: "unique-email",
        message: "Email already exists",
        test: (value) => !listOfUsers.some((user) => user?.email === value), // ✅ FIXED LOGIC
      }),
    password: Yup.string()
      .required("Password is required")
      .min(3, "Must be at least 3 characters")
      .max(15, "Must be 15 characters or less"),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${domain}/users/register`, data);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
        setSent(true); // ✅ Moved inside the success case
      }
    } catch (error) {
      alert("Registration failed, please try again.");
    }
  };

  return (
    <>
      {sent ? (
        <Registered />
      ) : (
        <div className="min-h-screen flex items-start pt-25 justify-center bg-gray-900 text-white px-4">
          <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              Create an Account
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              validateOnChange={false}
            >
              <Form className="space-y-4">
                <Input type="username" label="Username" />
                <Input type="email" label="Email" />
                <Input type="password" label="Password" />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  REGISTER
                </button>
              </Form>
            </Formik>
            <p className="text-center text-sm mt-4">
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

function Input({ type, label }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <ErrorMessage
        name={type}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
      <Field
        autoComplete="off"
        id={"unique-" + type}
        name={type}
        type={type}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
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
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
