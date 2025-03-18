import { AuthContext, ProfilePicContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  listAll,
} from "firebase/storage";
import { storage } from "../firebase";

export default function Settings() {
  const { user, domain } = AuthContext();
  const { imageUrl, setImageUrl, pfpLoading } = ProfilePicContext();
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [zrkey, setZrKey] = useState(user.zrkey);
  const [zrtoken, setZrToken] = useState(user.zrtoken);
  const [yalidinekey, setYalidineKey] = useState(user.yalidinekey);
  const [yalidinetoken, setYalidineToken] = useState(user.yalidinetoken);
  const [error, setError] = useState("");
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [secondRequest, setSecondRequest] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  //check if user has the right to send a second email verification request
  useEffect(() => {
    if (user.secondEVR) {
      setSecondRequest(true);
    } else {
      setSecondRequest(false);
    }
  }, [user.secondEVR]);

  //reset the error message
  useEffect(() => {
    setError("");
  }, [newPass, newPass2]);

  //reset password
  const reset = () => {
    const data = {
      password: newPass,
      password2: newPass2,
    };
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    if (newPass !== newPass2) {
      setError("Passwords dosent match!");
    } else if (newPass.length <= 3) {
      setError("password must be above 3 characters");
    } else {
      axios
        .post(`${domain}/users/resetpassword/`, data, config)
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.error) {
            setError(response.data.error);
          } else if (response.data.noExist) {
            router.push("/");
          } else {
            setNewPass("");
            setNewPass2("");
            setError("");
            alert("Password updated!");
          }
        });
    }
  };

  //reset zr tokens
  const updateZr = () => {
    const data = {
      zrkey: zrkey,
      zrtoken: zrtoken,
    };
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    axios.post(`${domain}/users/zr/`, data, config).then((response) => {
      if (response.data.noToken) {
        router.push("/unwanted-page");
        sessionStorage.clear();
        localStorage.clear();
      }
      if (response.data.error) {
        alert(response.data.error);
      } else if (response.data.noExist) {
        router.push("/");
      } else {
        alert("New zr keys updated");
      }
    });
  };

  //yalidine tokens
  const updateYalidine = () => {
    const data = {
      yalidinekey: yalidinekey,
      yalidinetoken: yalidinetoken,
    };
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    axios.post(`${domain}/users/yalidine/`, data, config).then((response) => {
      if (response.data.noToken) {
        router.push("/unwanted-page");
        sessionStorage.clear();
        localStorage.clear();
      }
      if (response.data.error) {
        alert(response.data.error);
      } else if (response.data.noExist) {
        router.push("/");
      } else {
        alert("New yalidine keys updated");
      }
    });
  };

  const deleteSheet = async () => {
    const response = await axios.post(
      `${domain}/orders/deletesheet`,
      {
        sheetID: user.sheetID,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      }
    );
    await deleteAccount();
  };
  //delete account
  const deleteAccount = async () => {
    try {
      const storageRef = ref(storage, `${user._id}/`);
      const response = await axios.post(
        `${domain}/users/deleteaccount`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("accessToken") || "",
          },
        }
      );
      if (response.data.noToken) {
        router.push("/unwanted-page");
        sessionStorage.clear();
        localStorage.clear();
      }
      if (response.data.error) {
        alert("Failed, try again");
      } else if (response.data.noExist) {
        router.push("/");
      } else {
        //delete user pfp
        getMetadata(storageRef)
          .then(() => {
            deleteObject(storageRef);
            setImageUrl(null);
          })
          .catch(() => {});
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("subscribeToken");
        router.push("/");
      }
    } catch (error) {
      router.push("/unwanted-page");
      sessionStorage.clear();
      localStorage.clear();
      setLogged(false);
    }
  };

  //Send another email verification request
  const onRequest = () => {
    if (secondRequest) {
      axios
        .post(
          `${domain}/users/emailverification`,
          { email: user.email },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken") || "",
            },
          }
        )
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.evrSent) {
            setSecondRequest(false);
          } else if (response.data.noExist) {
            router.push("/");
          } else {
            alert(response.data.error);
          }
        });
    }
  };

  //update profile pic
  const uploadFile = () => {
    if (imageUpload === null) return;
    setUploading(true);
    const newPath = `${user._id}/profilePic/pfp`;
    const imageRef = ref(storage, newPath);
    //uploading the new image with a new path
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          const config = {
            headers: {
              accessToken: localStorage.getItem("accessToken") || "",
            },
          };
          const data = {
            path: url,
            pfp: true,
          };
          axios
            .post(`${domain}/users/profilepic`, data, config)
            .then((response) => {
              if (response.data.noToken) {
                router.push("/unwanted-page");
                sessionStorage.clear();
                localStorage.clear();
              }
              if (response.data.error) {
                alert(response.data.error);
                setUploading(false);
              } else if (response.data.noExist) {
                router.push("/");
              } else {
                //updating the ui
                setImageUrl(url);
                setPreviewUrl(null);
                //reset the image input
                fileInputRef.current.value = "";
                setImageUpload(null);
                setUploading(false);
              }
            });
        });
      })
      .catch((error) => {
        alert(error);
        setUploading(false);
      });
  };

  //delete profilc pic
  const deleteImage = () => {
    if (!user.pfp) return;
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    const data = {
      path: "",
      pfp: false,
    };
    axios.post(`${domain}/users/profilepic`, data, config).then((response) => {
      if (response.data.noToken) {
        router.push("/unwanted-page");
        sessionStorage.clear();
        localStorage.clear();
      }
      if (response.data.error) {
        alert(response.data.error);
      } else {
        //reuse the default pic since the user pfp is deleted
        const imageRef = ref(storage, `defaults/profilePic`);
        listAll(imageRef)
          .then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImageUrl(url);
              });
              return;
            });
          })
          .catch(() => {
            window.location.reload();
          });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <UserData user={user} />
      <SecondVerification
        user={user}
        secondRequest={secondRequest}
        onRequest={onRequest}
      />
      <ResetPasswordForm
        setNewPass={setNewPass}
        setNewPass2={setNewPass2}
        reset={reset}
        error={error}
      />
      <ProfilePic
        imageUrl={imageUrl}
        pfpLoading={pfpLoading}
        previewUrl={previewUrl}
      />
      <UpdateProfilePic
        user={user}
        fileInputRef={fileInputRef}
        uploading={uploading}
        previewUrl={previewUrl}
        imageUpload={imageUpload}
        setPreviewUrl={setPreviewUrl}
        setImageUpload={setImageUpload}
        uploadFile={uploadFile}
        deleteImage={deleteImage}
      />
      <UpdateZrForm
        zrkey={zrkey}
        zrtoken={zrtoken}
        setZrKey={setZrKey}
        setZrToken={setZrToken}
        updateZr={updateZr}
      />
      <UpdateYalidineForm
        yalidinekey={yalidinekey}
        yalidinetoken={yalidinetoken}
        setYalidineKey={setYalidineKey}
        setYalidineToken={setYalidineToken}
        updateYalidine={updateYalidine}
      />
      <DeleteAccountButton
        deleteAcc={deleteAcc}
        setDeleteAcc={setDeleteAcc}
        deleteSheet={deleteSheet}
      />
    </div>
  );
}

function UserData({ user }) {
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <p className="font-semibold">
        Username: <span className="text-gray-700">{user.username}</span>
      </p>
      <p className="font-semibold">
        Email:
        <span className="text-gray-700">
          {" "}
          {user.email.replace(/(.{2}).*(@.*)/, "$1*****$2")}
        </span>
        <span className={user.verified ? "text-green-500" : "text-red-500"}>
          {user.verified ? " (Verified)" : " (Not Verified)"}
        </span>
      </p>
    </div>
  );
}

function SecondVerification({ user, secondRequest, onRequest }) {
  return (
    <>
      {user.verified ? (
        <></>
      ) : secondRequest ? (
        <button
          onClick={onRequest}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Send one last request
        </button>
      ) : (
        <p className="text-gray-600 mt-3">
          Check your mail to verify your account
        </p>
      )}
    </>
  );
}

function ResetPasswordForm({ setNewPass, setNewPass2, reset, error }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setNewPass(e.target.value)}
      />
      <input
        type="password"
        placeholder="Re-enter new password"
        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setNewPass2(e.target.value)}
      />
      <button
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={reset}
      >
        Reset Password
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

function ProfilePic({ imageUrl, pfpLoading, previewUrl }) {
  return (
    <div className="flex justify-center mt-4">
      {pfpLoading ? (
        <p className="text-gray-500">Image Loading...</p>
      ) : (
        <div
          className="w-20 h-20 rounded-full bg-cover bg-center shadow-md"
          style={{ backgroundImage: `url(${previewUrl || imageUrl})` }}
        ></div>
      )}
    </div>
  );
}

function UpdateProfilePic({
  fileInputRef,
  uploading,
  setPreviewUrl,
  setImageUpload,
  uploadFile,
  deleteImage,
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <input
        type="file"
        className="w-full p-2 border rounded-md focus:outline-none"
        onChange={(e) => {
          setImageUpload(e.target.files[0]);
          setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }}
        ref={fileInputRef}
      />
      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={uploadFile}
        >
          Save Image
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            setImageUpload(null);
            setPreviewUrl(null);
            fileInputRef.current.value = "";
          }}
        >
          Cancel
        </button>
      </div>
      <button
        className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={deleteImage}
      >
        Delete Image
      </button>
    </div>
  );
}

function DeleteAccountButton({ deleteAcc, setDeleteAcc, deleteSheet }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => setDeleteAcc(!deleteAcc)}
      >
        Delete Account?
      </button>
      {deleteAcc && (
        <div className="mt-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setDeleteAcc(false)}
          >
            No
          </button>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 ml-2"
            onClick={deleteSheet}
          >
            Yes
          </button>
        </div>
      )}
    </div>
  );
}

function UpdateZrForm({ zrkey, zrtoken, setZrKey, setZrToken, updateZr }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <input
        value={zrkey}
        placeholder="Enter your ZR key"
        required
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(event) => setZrKey(event.target.value)}
      />
      <input
        value={zrtoken}
        placeholder="Enter your ZR token"
        required
        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(event) => setZrToken(event.target.value)}
      />
      <button
        type="submit"
        onClick={updateZr}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update ZR Tokens
      </button>
    </div>
  );
}

function UpdateYalidineForm({
  yalidinekey,
  yalidinetoken,
  setYalidineKey,
  setYalidineToken,
  updateYalidine,
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <input
        value={yalidinekey}
        placeholder="Enter your Yalidine key"
        required
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(event) => setYalidineKey(event.target.value)}
      />
      <input
        value={yalidinetoken}
        placeholder="Enter your Yalidine token"
        required
        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(event) => setYalidineToken(event.target.value)}
      />
      <button
        type="submit"
        onClick={updateYalidine}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Yalidine Tokens
      </button>
    </div>
  );
}
