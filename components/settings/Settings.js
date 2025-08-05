import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import { storage } from "../../firebase";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { user, domain, imageUrl, setImageUrl } = AuthContext();
  const router = useRouter();

  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [zrkey, setZrKey] = useState(user?.zrkey);
  const [zrtoken, setZrToken] = useState(user?.zrtoken);
  const [yalidinekey, setYalidineKey] = useState(user?.yalidinekey);
  const [yalidinetoken, setYalidineToken] = useState(user?.yalidinetoken);
  const [error, setError] = useState("");
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [secondRequest, setSecondRequest] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const updatingStyle = updating ? "pointer-events-none opacity-60" : "";

  const handleNoUser = () => {
    const msg = "You are out of session. Please log in again.";
    router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
    localStorage.removeItem("accessToken");
  };

  const handleDeleteAccount = () => {
    const msg = "Your account no longer exists.";
    router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
    localStorage.removeItem("accessToken");
  };

  //check if user has the right to send a second email verification request
  useEffect(() => {
    if (user?.secondEVR) {
      setSecondRequest(true);
    } else {
      setSecondRequest(false);
    }
  }, [user?.secondEVR]);

  //reset the error message whenever the user types on the input fields
  useEffect(() => {
    setError("");
  }, [newPass, newPass2, router]);

  //reset password
  const reset = async () => {
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
    } else if (newPass.length > 20) {
      setError("password must less than 20 characters");
    } else {
      try {
        setUpdating(true);
        const response = await axios.patch(
          `${domain}/users/reset-password/`,
          data,
          config
        );
        setNewPass("");
        setNewPass2("");
        setError("");
        setUpdating(false);
        toast.success("Password updated successfully");
      } catch (err) {
        if (err?.response?.status === 401) {
          handleNoUser();
        } else if (err?.response?.status === 400) {
          setError("Passwords do not match.");
          setUpdating(false);
        } else {
          toast.error("An error occurred. Please try again.");
          setError("Please try again.");
          setUpdating(false);
        }
      }
    }
  };

  //reset zr tokens
  const updateZr = async () => {
    const data = {
      zrkey: zrkey,
      zrtoken: zrtoken,
    };
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    try {
      setUpdating(true);
      const response = await axios.patch(
        `${domain}/users/zr-token/`,
        data,
        config
      );
      toast.success("Zr express tokens updated successfully.");
      setUpdating(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleNoUser();
      } else {
        toast.error("An error occurred. Please try again.");
        setUpdating(false);
      }
    }
  };

  //reset yalidine tokens
  const updateYalidine = async () => {
    return;
  };

  //Send another email verification request
  const onRequest = async () => {
    if (secondRequest) {
      try {
        setUpdating(true);
        const response = await axios.post(
          `${domain}/users/email-verification`,
          { email: user?.email },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken") || "",
            },
          }
        );
        setSecondRequest(false);
        setUpdating(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleNoUser();
        } else {
          toast.error("An error occurred. Please try again.");
          setUpdating(false);
        }
      }
    }
  };

  //update profile pic
  const uploadFile = async () => {
    if (imageUpload === null) return;
    setUpdating(true);
    const newPath = `${user?._id}/profilePic/pfp`;
    const imageRef = ref(storage, newPath);
    try {
      //uploading the new image with a new path
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      const config = {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      };
      const data = {
        path: url,
        pfp: true,
      };
      try {
        const response = await axios.patch(
          `${domain}/users/profile-picture`,
          data,
          config
        );
        //updating the ui
        setImageUrl(url);
        setPreviewUrl(null);
        //reset the image input
        fileInputRef?.current && (fileInputRef.current.value = "");
        setImageUpload(null);
        setUpdating(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleNoUser();
        } else {
          toast.error("An error occurred. Please try again.");
          setUpdating(false);
        }
      }
    } catch {
      toast.error("Upload images failed. Please try again.");
      setUpdating(false);
    }
  };

  //delete account
  const deleteAccount = async () => {
    setUpdating(true);
    let storageRef;
    storageRef = ref(storage, `${user?._id}/`);
    const config = {
      headers: {
        accessToken: localStorage.getItem("accessToken") || "",
      },
    };
    const data = {};
    try {
      const response = await axios.post(
        `${domain}/users/delete-account`,
        data,
        config
      );
      handleDeleteAccount();
      //delete user pfp
      getMetadata(storageRef)
        .then(() => {
          deleteObject(storageRef);
          setImageUrl(null);
        })
        .finally(() => {});
    } catch (err) {
      if (err?.response?.status === 401) {
        handleNoUser();
      } else {
        toast.error("An error occurred. Please try again.");
        setUpdating(false);
      }
    }
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg ${updatingStyle}`}
    >
      <UserData user={user} />
      <SecondVerification
        user={user}
        secondRequest={secondRequest}
        onRequest={onRequest}
      />
      <ResetPasswordForm
        newPass={newPass}
        newPass2={newPass2}
        setNewPass={setNewPass}
        setNewPass2={setNewPass2}
        reset={reset}
        error={error}
        setError={setError}
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
      >
        <div className="flex justify-center mt-4">
          <div
            className="w-20 h-20 rounded-full bg-cover bg-center shadow-md"
            style={{ backgroundImage: `url(${previewUrl || imageUrl})` }}
          ></div>
        </div>
      </UpdateProfilePic>
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
        deleteAccount={deleteAccount}
      />
    </div>
  );
}

function UserData({ user }) {
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <p className="font-semibold">
        Username: <span className="text-gray-700">{user?.username}</span>
      </p>
      <p className="font-semibold">
        Email:
        <span className="text-gray-700">
          {" "}
          {user?.email?.replace(/(.{2}).*(@.*)/, "$1*****$2")}
        </span>
        <span className={user?.verified ? "text-green-500" : "text-red-500"}>
          {user?.verified ? " (Verified)" : " (Not Verified)"}
        </span>
      </p>
    </div>
  );
}

function SecondVerification({ user, secondRequest, onRequest }) {
  return (
    <>
      {user?.verified ? (
        <></>
      ) : secondRequest ? (
        <button
          onClick={onRequest}
          className="mb-6 bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600 hover:scale-105 transition-transform duration-150"
        >
          Send one last request
        </button>
      ) : (
        <p className="text-gray-600 mb-6">
          Check your mail to verify your account
        </p>
      )}
    </>
  );
}

function ResetPasswordForm({
  newPass,
  newPass2,
  setNewPass,
  setNewPass2,
  reset,
  error,
  setError,
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setNewPass(e.target.value)}
        onFocus={() => setError(null)}
        value={newPass}
      />
      <input
        type="password"
        placeholder="Re-enter new password"
        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setNewPass2(e.target.value)}
        onFocus={() => setError(null)}
        value={newPass2}
      />
      <button
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={reset}
      >
        Reset Password
      </button>
    </div>
  );
}

function UpdateProfilePic({
  children,
  fileInputRef,
  previewUrl,
  setPreviewUrl,
  setImageUpload,
  uploadFile,
}) {
  return (
    <>
      {children}
      <div className="p-4 bg-gray-100 rounded-lg mt-4">
        <p className="mb-2 text-gray-600 text-sm">
          Update your profile picture (JPG, PNG, max 2MB)
        </p>
        <input
          type="file"
          className="w-full p-2 border rounded-md focus:outline-none cursor-pointer hover:border-blue-400"
          onChange={(e) => {
            setImageUpload(e.target.files?.[0]);
            setPreviewUrl(
              e.target.files?.[0]
                ? URL.createObjectURL(e.target.files[0])
                : null
            );
          }}
          ref={fileInputRef}
        />
        {previewUrl && (
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer transition-colors"
              onClick={uploadFile}
            >
              Save Image
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer transition-colors"
              onClick={() => {
                setImageUpload(null);
                setPreviewUrl(null);
                fileInputRef?.current && (fileInputRef.current.value = "");
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
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

function DeleteAccountButton({ deleteAcc, setDeleteAcc, deleteAccount }) {
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
            onClick={deleteAccount}
          >
            Yes
          </button>
        </div>
      )}
    </div>
  );
}
