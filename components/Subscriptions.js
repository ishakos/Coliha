import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useRouter } from "next/navigation";

export default function Subscriptions() {
  const { user, purchasedOffer, domain } = AuthContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [offers, setOffers] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const containerStyles = {
    opacity: uploading ? 0.6 : 1,
    pointerEvents: uploading ? "none" : "auto",
  };

  //fetch the offers data
  useEffect(() => {
    axios.get(`${domain}/subscribers`).then((response) => {
      if (!response.data.error) {
        setOffers(response.data.offers);
      } else {
        router.push("/unwanted-page");
      }
    });
  }, []);

  //upload the receipt
  const uploadFile = () => {
    if (imageUpload === null) return;
    if (selectedOption === null) return;
    setUploading(true);
    axios
      .get(`${domain}/users/auth`, {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      })
      .then((response) => {
        if (response.data.noToken) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.data.error) {
          router.push("/unwanted-page");
        } else {
          const newPath = `${user._id}/orders/receipt`;
          const imageRef = ref(storage, newPath);
          //uploading the new image with a new path
          uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then(() => {
                //updating the ui
                setPreviewUrl(null);
                //reset the image input
                fileInputRef.current.value = "";
                const config = {
                  headers: {
                    accessToken: localStorage.getItem("accessToken") || "",
                  },
                };
                const data = {
                  offerRequested: selectedOption.title,
                };
                //updating user's data in db
                axios
                  .post(`${domain}/subscribers/orderoffer`, data, config)
                  .then((response) => {
                    if (response.data.noToken) {
                      router.push("/unwanted-page");
                      sessionStorage.clear();
                      localStorage.clear();
                    }
                    if (response.data.error) {
                      router.push("/unwanted-page");
                    } else if (response.data.noExist) {
                      router.push("/");
                    } else {
                      setImageUpload(null);
                      setUploading(false);
                      setSelectedOption(false);
                      window.location.reload();
                    }
                  });
              });
            })
            .catch(() => {
              alert("Upload failed, try again");
            });
        }
      });
  };

  return (
    <>
      {!user ? (
        <>No user data.</>
      ) : user.verified ? (
        <>
          {Object.keys(purchasedOffer).length !== 0 > 0 ? (
            <p>you're currently have: {purchasedOffer.title}</p>
          ) : (
            <p>You have no offer</p>
          )}
          {!user.hasSubscribeRequest ? (
            offers ? (
              <div style={containerStyles}>
                {offers.slice(1).map((offer, index) => (
                  <Offer
                    key={index + 1}
                    offer={offer}
                    setSelectedOption={setSelectedOption}
                    isActive={selectedOption === offer}
                  />
                ))}
                {selectedOption ? (
                  <UploadReceipt
                    fileInputRef={fileInputRef}
                    imageUpload={imageUpload}
                    setImageUpload={setImageUpload}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    uploadFile={uploadFile}
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <>Offers loading...</>
            )
          ) : (
            <>
              <p>
                you already have a pending request, please wait until the admins
                verify it. <span>Offer Requested: {user.offerRequested}</span>
              </p>
            </>
          )}
        </>
      ) : (
        <p>You need to verify your email to subscribe</p>
      )}
      <p>Contact us: example@email.com</p>
    </>
  );
}

function Offer({ offer, setSelectedOption, isActive }) {
  return (
    <div
      className={`offer ${isActive ? "active" : ""}`}
      onClick={() => setSelectedOption(offer)}
    >
      <p>{offer.title}</p>
      <p>{offer.description}</p>
      <p>price {offer.price}</p>
    </div>
  );
}

function UploadReceipt({
  fileInputRef,
  imageUpload,
  previewUrl,
  setPreviewUrl,
  setImageUpload,
  uploadFile,
}) {
  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
          setPreviewUrl(URL.createObjectURL(event.target.files[0]));
        }}
        ref={fileInputRef}
      />
      {previewUrl ? (
        <div
          style={{
            backgroundImage: `url(${previewUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
            width: "60px", // Add width and height to see the background image
            height: "60px",
          }}
        ></div>
      ) : (
        <></>
      )}
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
    </div>
  );
}
