import { useEffect, useState } from "react";
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
  const { domain } = AuthContext();
  const router = useRouter();

  //fetching users
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
  }, []);

  if (loadingFetch) {
    return <div>Please Hold On...</div>;
  }

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required()
      .min(3)
      .max(15)
      .test({
        name: "unique-username",
        message: () => {
          return "Username already exists";
        },
        test: (value) => {
          return !checkUsername(value);
        },
      })
      .matches(/^\S*$/, "Username should not contain spaces"),
    email: Yup.string()
      .required()
      .email()
      .test({
        name: "unique-email",
        message: () => {
          return "Email already exists";
        },
        test: (value) => {
          return !checkEmail(value);
        },
      }),
    password: Yup.string().required().min(3).max(15),
  });

  //small note: forEach daretly problem m3a l validation
  function checkUsername(username) {
    for (let i = 0; i < listOfUsers.length; i++) {
      if (listOfUsers[i]?.username === username) {
        return true;
      }
      return false;
    }
  }

  function checkEmail(email) {
    for (let i = 0; i < listOfUsers.length; i++) {
      if (listOfUsers[i]?.email === email) {
        return true;
      }
      return false;
    }
  }

  const onSubmit = (data) => {
    axios.post(`${domain}/users/register`, data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
      }
    });
    setSent(true);
  };

  return (
    <>
      {sent ? (
        <Registered />
      ) : (
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
          >
            <Form>
              <Input type={"username"} />
              <Input type={"email"} />
              <Input type={"password"} />
              <button type="submit">REGISTER</button>
            </Form>
          </Formik>
        </div>
      )}
    </>
  );
}

function Input({ type }) {
  return (
    <div className="login-form">
      <ErrorMessage name={type} component="span" />
      <Field
        autoComplete="off"
        id={"unique-" + type}
        name={type}
        type={type}
        placeholder={"Put your " + type}
      />
    </div>
  );
}

function Registered() {
  return (
    <div>
      <p>
        Verify your email otherwise your account will be deleted after one month
      </p>
      <Link href={"/login"}>Go home</Link>
    </div>
  );
}
