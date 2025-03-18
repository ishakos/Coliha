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

  useEffect(() => {
    axios.get(`${domain}/subscribers`).then((response) => {
      if (!response.data.error) {
        setOffers(response.data.offers);
      } else {
        router.push("/unwanted-page");
      }
    });
  }, [domain, router]);

  const uploadFile = () => {
    if (imageUpload === null || selectedOption === null) return;
    setUploading(true);
    axios
      .get(`${domain}/users/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") || "" },
      })
      .then((response) => {
        if (response.data.noToken || response.data.error) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        } else {
          const newPath = `${user._id}/orders/receipt`;
          const imageRef = ref(storage, newPath);
          uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then(() => {
                setPreviewUrl(null);
                fileInputRef.current.value = "";
                const config = {
                  headers: {
                    accessToken: localStorage.getItem("accessToken") || "",
                  },
                };
                const data = { offerRequested: selectedOption.title };
                axios
                  .post(`${domain}/subscribers/orderoffer`, data, config)
                  .then((response) => {
                    if (response.data.noToken || response.data.error) {
                      router.push("/unwanted-page");
                      sessionStorage.clear();
                      localStorage.clear();
                    } else if (response.data.noExist) {
                      router.push("/");
                    } else {
                      setImageUpload(null);
                      setUploading(false);
                      setSelectedOption(null);
                      window.location.reload();
                    }
                  });
              });
            })
            .catch(() => alert("Upload failed, try again"));
        }
      });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      {!user ? (
        <p className="text-red-500 text-center">No user data.</p>
      ) : user.verified ? (
        <>
          {Object.keys(purchasedOffer).length !== 0 ? (
            <p className="text-lg font-semibold text-gray-700">
              You are currently subscribed to:{" "}
              <span className="text-blue-600">{purchasedOffer.title}</span>
            </p>
          ) : (
            <p className="text-lg font-semibold text-gray-700">
              You have no offer
            </p>
          )}
          {!user.hasSubscribeRequest ? (
            offers.length > 0 ? (
              <div
                className={`${
                  uploading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <div className="grid gap-4 mt-4">
                  {offers.slice(1).map((offer, index) => (
                    <Offer
                      key={index}
                      offer={offer}
                      setSelectedOption={setSelectedOption}
                      isActive={selectedOption === offer}
                    />
                  ))}
                </div>
                {selectedOption && (
                  <UploadReceipt
                    fileInputRef={fileInputRef}
                    imageUpload={imageUpload}
                    setImageUpload={setImageUpload}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    uploadFile={uploadFile}
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500 mt-3">Offers loading...</p>
            )
          ) : (
            <p className="text-gray-700 mt-3">
              You already have a pending request. Please wait until the admins
              verify it.
              <br />
              <span className="font-semibold">
                Offer Requested: {user.offerRequested}
              </span>
            </p>
          )}
        </>
      ) : (
        <p className="text-red-500">
          You need to verify your email to subscribe
        </p>
      )}
      <p className="mt-4 text-center text-gray-600">
        Contact us: example@email.com
      </p>
    </div>
  );
}

function Offer({ offer, setSelectedOption, isActive }) {
  return (
    <div
      className={`p-4 border rounded-md cursor-pointer transition ${
        isActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onClick={() => setSelectedOption(offer)}
    >
      <p className="font-semibold text-lg">{offer.title}</p>
      <p className="text-gray-600">{offer.description}</p>
      <p className="text-blue-600 font-semibold">Price: {offer.price}</p>
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
    <div className="mt-6 p-4 border rounded-md">
      <input
        type="file"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
          setPreviewUrl(URL.createObjectURL(event.target.files[0]));
        }}
        ref={fileInputRef}
      />
      {previewUrl && (
        <div className="mt-3 flex justify-center">
          <div
            className="w-16 h-16 bg-cover bg-center rounded-md shadow-md"
            style={{ backgroundImage: `url(${previewUrl})` }}
          ></div>
        </div>
      )}
      {imageUpload && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={uploadFile}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save Image
          </button>
          <button
            onClick={() => {
              setImageUpload(null);
              setPreviewUrl(null);
              fileInputRef.current.value = "";
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
