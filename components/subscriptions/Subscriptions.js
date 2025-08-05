import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Subscriptions() {
  const { user, purchasedOffer, domain } = AuthContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [offers, setOffers] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasSubscribeRequest, setHasSubscribeRequest] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  //Check if user has already a subscribe request
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${domain}/subscribers`);
        setOffers(response.data?.offers ?? []);
      } catch (error) {
        toast.error("Small thing went wrong. Try Reloading.");
      }
    };
    const checkSubscribeRequest = async () => {
      if (user?.hasSubscribeRequest) {
        setHasSubscribeRequest(true);
      } else {
        setHasSubscribeRequest(false);
        await fetchOffers();
      }
    };
    checkSubscribeRequest();
  }, [domain, user?.hasSubscribeRequest]);

  const uploadFile = async () => {
    if (imageUpload === null || selectedOption === null) return;
    const newPath = `${user?._id}/orders/receipt`;
    const imageRef = ref(storage, newPath);
    try {
      setUploading(true);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      await getDownloadURL(snapshot.ref);
      const config = {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      };
      const data = { offerRequested: selectedOption?.title };
      try {
        const response = await axios.patch(
          `${domain}/subscribers/order-new-offer`,
          data,
          config
        );
        toast.success("Request sent successfully.");
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        if (err.response?.status === 401) {
          const msg = "Your session has expired. Please log in again.";
          router.push(`/unwanted-page?error=${encodeURIComponent(msg)}`);
          localStorage.removeItem("accessToken");
        } else {
          toast.error("An error occurred while sending your request.");
          setUploading(false);
        }
      }
    } catch {
      toast.error(
        "An error occurred while uploading your receipt. Please try again."
      );
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-10 max-w-2xl w-full bg-white shadow-lg rounded-xl flex-grow">
        {!user ? (
          <p className="text-red-500 text-center">No user data.</p>
        ) : user?.verified ? (
          <>
            <CurrentSubscription purchasedOffer={purchasedOffer} />
            <SubscriptionsContent
              hasSubscribeRequest={hasSubscribeRequest}
              offers={offers}
              uploading={uploading}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              fileInputRef={fileInputRef}
              imageUpload={imageUpload}
              setImageUpload={setImageUpload}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              uploadFile={uploadFile}
              user={user}
            />
          </>
        ) : (
          <p className="text-red-500">
            You need to verify your email to subscribe
          </p>
        )}
        <p className="mt-6 text-center text-gray-600 text-lg">
          Contact us: example@email.com
        </p>
      </div>
    </div>
  );
}

function CurrentSubscription({ purchasedOffer }) {
  return (
    <>
      {Object.keys(purchasedOffer ?? {}).length !== 0 ? (
        <p className="text-2xl font-semibold text-gray-700">
          You are currently subscribed to:{" "}
          <span className="text-blue-600">{purchasedOffer?.title}</span>
        </p>
      ) : (
        <p className="text-2xl font-semibold text-gray-700">
          You are not subscribed to any offer yet.
        </p>
      )}
    </>
  );
}

function SubscriptionsContent({
  hasSubscribeRequest,
  offers,
  uploading,
  selectedOption,
  setSelectedOption,
  fileInputRef,
  imageUpload,
  setImageUpload,
  previewUrl,
  setPreviewUrl,
  uploadFile,
  user,
}) {
  return (
    <>
      {hasSubscribeRequest ? (
        <p className="text-gray-700 mt-3">
          You already have a pending request. Please wait until the admins
          verify it.
          <br />
          <span className="font-semibold">
            Offer Requested: {user?.offerRequested}
          </span>
        </p>
      ) : !offers?.length > 0 ? (
        <p className="text-gray-500 mt-3">Offers loading...</p>
      ) : (
        <div className={`${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          <div className="grid gap-6 mt-6">
            {offers
              ?.filter((offer) => offer?.title?.toLowerCase() !== "free trial")
              .map((offer, index) => (
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
      )}
    </>
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
      onClick={() => {
        setSelectedOption(offer);
      }}
    >
      <p className="font-semibold text-lg">{offer?.title}</p>
      <p className="text-gray-600">{offer?.description}</p>
      <p className="text-blue-600 font-semibold">Price: {offer?.price}</p>
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
          setImageUpload(event.target.files?.[0] ?? null);
          setPreviewUrl(
            event.target.files?.[0]
              ? URL.createObjectURL(event.target.files[0])
              : null
          );
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
              if (fileInputRef?.current) fileInputRef.current.value = "";
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
