import { AuthContext, ProfilePicContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

export default function Settings() {
  //imageUrl = current visible profile pic on UI
  const { user, domain } = AuthContext();
  const { imageUrl, setImageUrl, pfpLoading } = ProfilePicContext();
  //passwords inputs
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  //token/keys inputs
  const [zrkey, setZrKey] = useState(user.zrkey);
  const [zrtoken, setZrToken] = useState(user.zrtoken);
  const [yalidinekey, setYalidineKey] = useState(user.yalidinekey);
  const [yalidinetoken, setYalidineToken] = useState(user.yalidinetoken);
  //error message
  const [error, setError] = useState("");
  //delete account button
  const [deleteAcc, setDeleteAcc] = useState(false);
  //to see if user can send another email verification request
  const [secondRequest, setSecondRequest] = useState(null);
  //image input
  const [imageUpload, setImageUpload] = useState(null);
  //new profile pic preview
  const [previewUrl, setPreviewUrl] = useState(null);
  //when image is being uploaded into firebase
  const [uploading, setUploading] = useState(false);
  //to reset image input value to null
  const fileInputRef = useRef(null);
  const router = useRouter();

  //check if user has the right to send a second email verification request
  useEffect(() => {
    if (user.secondEVR) {
      setSecondRequest(true);
    } else {
      setSecondRequest(false);
    }
  }, []);

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
    <>
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
    </>
  );
}

function UserData({ user }) {
  //to tell unverified users how much time left until the account is deleted
  //or to tell subscribers how much time left for their current payed offer
  const deletionDate = new Date(user.createdAt);
  deletionDate.setMonth(deletionDate.getMonth() + 1);
  return (
    <div>
      <p>
        Username : <span>{user.username}</span>
      </p>
      <p>
        Email :
        <span>
          {`${user.email.split("@")[0][0]}${user.email.split("@")[0][1]}*****@${
            user.email.split("@")[1]
          }`}
        </span>
        <span>{user.verified ? " (Verified)" : " (Not Verified)"}</span>
      </p>
      {user.verified
        ? ""
        : `Your account will be deleted on: ${deletionDate.toLocaleString()}`}
    </div>
  );
}

function SecondVerification({ user, secondRequest, onRequest }) {
  return (
    <>
      {user.verified ? (
        <></>
      ) : secondRequest ? (
        <button onClick={onRequest}>Send one last request</button>
      ) : (
        "Check your mail to verify your account"
      )}
    </>
  );
}

function ResetPasswordForm({ setNewPass, setNewPass2, reset, error }) {
  return (
    <div>
      <input
        type="password"
        placeholder="enter your new password"
        required
        minLength="3"
        onChange={(event) => {
          setNewPass(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="re-enter your new password"
        required
        minLength="3"
        onChange={(event) => {
          setNewPass2(event.target.value);
        }}
      />
      <button type="submit" onClick={reset}>
        Reset Password
      </button>
      <p>{error}</p>
    </div>
  );
}

function ProfilePic({ imageUrl, pfpLoading, previewUrl }) {
  return (
    <>
      {pfpLoading ? (
        <p>Image Loading...</p>
      ) : (
        <div
          style={{
            backgroundImage: previewUrl
              ? `url(${previewUrl})`
              : `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
            width: "60px", // Add width and height to see the background image
            height: "60px",
            borderRadius: "100%",
          }}
        ></div>
      )}
    </>
  );
}

function UpdateProfilePic({
  user,
  fileInputRef,
  uploading,
  imageUpload,
  setPreviewUrl,
  setImageUpload,
  uploadFile,
  deleteImage,
}) {
  const containerStyles = {
    opacity: uploading ? 0.6 : 1,
    pointerEvents: uploading ? "none" : "auto",
  };
  return (
    <div style={containerStyles}>
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
          setPreviewUrl(URL.createObjectURL(event.target.files[0]));
        }}
        ref={fileInputRef}
      />
      {imageUpload ? (
        <div>
          <button onClick={uploadFile}>Save Image</button>
          <button
            onClick={() => {
              setImageUpload(null);
              setPreviewUrl(null);
              fileInputRef.current.value = "";
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <></>
      )}
      {user.pfp ? <button onClick={deleteImage}>Delete image</button> : <></>}
    </div>
  );
}

function DeleteAccountButton({ setDeleteAcc, deleteAcc, deleteSheet }) {
  return (
    <>
      <button onClick={() => setDeleteAcc((deleteAcc) => !deleteAcc)}>
        Delete Account?
      </button>
      {deleteAcc ? (
        <>
          <button onClick={() => setDeleteAcc((deleteAcc) => !deleteAcc)}>
            no
          </button>
          <button type="submit" onClick={deleteSheet}>
            yes
          </button>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function UpdateZrForm({ zrkey, zrtoken, setZrKey, setZrToken, updateZr }) {
  return (
    <div>
      <input
        value={zrkey}
        placeholder="enter your zr key"
        required
        onChange={(event) => {
          setZrKey(event.target.value);
        }}
      />
      <input
        value={zrtoken}
        placeholder="enter your zr token"
        required
        onChange={(event) => {
          setZrToken(event.target.value);
        }}
      />
      <button type="submit" onClick={updateZr}>
        Update Zr Tokens
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
    <div>
      <input
        value={yalidinekey}
        placeholder="enter your yalidine key"
        required
        onChange={(event) => {
          setYalidineKey(event.target.value);
        }}
      />
      <input
        value={yalidinetoken}
        placeholder="enter your yalidine token"
        required
        onChange={(event) => {
          setYalidineToken(event.target.value);
        }}
      />
      <button type="submit" onClick={updateYalidine}>
        Update Yalidine Tokens
      </button>
    </div>
  );
}
