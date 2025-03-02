"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useRouter } from "next/navigation";

const AuthCtx = createContext();
const ProfilePicCtx = createContext();
const SubscribeCtx = createContext();

export function AuthProvider({ children }) {
  //context1
  const [logged, setLogged] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [purchasedOffer, setPurchasedOffer] = useState([]);
  const [orders, setOrders] = useState([]);
  //context2
  const [imageUrl, setImageUrl] = useState(null);
  const [pfpLoading, setPfpLoading] = useState(true);
  //context3
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const domain = "http://localhost:3001";

  //context1
  useEffect(() => {
    let user = {};
    //checks token if valid before fetching
    const fetchUser = async () => {
      try {
        //no token = not logged
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLogged(false);
          setLoading(false);
          return;
        } else {
        }
        //checking token if valid
        const response = await axios.get(`${domain}/users/auth`, {
          headers: { accessToken: token || "" },
        });
        if (response.data.noToken) {
          setLogged(false);
          setLoading(false);
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        //if token is valid: we set the user's infos
        if (response.data.authentificated) {
          setLogged(true);
          setUser(response.data.authentificated);
          user = response.data.authentificated;
        } else {
          setLogged(false);
          setLoading(false);
          return;
        }
        await verifyOffer();
      } catch (error) {
        setLogged(false);
        setLoading(false);
        return;
      }
    };

    const verifyOffer = async () => {
      try {
        //if user has no offer = no need to fetch
        if (!user.purchasedOffer.offer) {
          setLoading(false);
          return;
        }
        const data = {
          username: user.username,
          expirationDate: user.purchasedOffer.EndsAt,
        };
        //check if user's offer not expired
        const response = await axios.post(
          `${domain}/subscribers/checkoffer`,
          data
        );
        //offer expired: set a new User with a null offer
        if (response.data.newUser) {
          setUser(response.data.newUser);
          user = response.data.newUser;
          setLoading(false);
          return;
        } else if (response.data.notExpired) {
          await fetchOffer();
        }
        //incase error
        else {
          console.error("User dont exist, or server error");
          router.push("/unwanted-page");
        }
      } catch (error) {
        console.error(error);
        router.push("/unwanted-page");
      }
    };

    const fetchOffer = async () => {
      try {
        const response = await axios.post(
          `${domain}/subscribers/purchasedoffer`,
          {
            userId: user._id,
          }
        );
        if (!response.data.error) {
          sessionStorage.setItem(
            "subscribeToken",
            response.data.subscribeToken
          );
          setPurchasedOffer(response.data.offer);
        } else {
          console.error("User | Offer does not exist, or server error");
          router.push("/unwanted-page");
        }
        await fetchOrders();
      } catch (error) {
        console.error(error);
        router.push("/unwanted-page");
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${domain}/orders`, {
          username: user.username,
        });
        if (response.data.error) {
          console.error(response.data.error);
        } else if (response.data.noExist) {
          setLogged(false);
          setLoading(false);
          sessionStorage.clear();
          localStorage.clear();
        } else {
          if (response.data.sheets) {
            setOrders(response.data.sheets);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        router.push("/unwanted-page");
      }
    };
    fetchUser();
  }, [pathname]);

  //context2
  useEffect(() => {
    if (!user) return;
    if (user.profilePic === "") {
      const imageRef = ref(storage, `defaults/profilePic/noProfilePic.png`);
      getDownloadURL(imageRef)
        .then((url) => {
          setImageUrl(url);
          const config = {
            headers: {
              accessToken: localStorage.getItem("accessToken") || "",
            },
          };
          const data = { path: url, pfp: true };
          axios
            .post(`${domain}/users/profilepic`, data, config)
            .then((response) => {
              if (response.data.noToken) {
                router.push("/unwanted-page");
                sessionStorage.clear();
                localStorage.clear();
              }
              if (!response.data.updated) {
                console.error("Couldnt update profile pic");
                router.push("/unwanted-page");
              } else {
                setPfpLoading(false);
              }
            });
        })
        .catch((error) => {
          console.error(error);
          router.push("/unwanted-page");
        });
    } else {
      setImageUrl(user.profilePic);
      setPfpLoading(false);
    }
  }, [user]);

  return (
    <AuthCtx.Provider
      value={{
        logged,
        loading,
        user,
        purchasedOffer,
        orders,
        setOrders,
        domain,
      }}
    >
      <ProfilePicCtx.Provider value={{ imageUrl, setImageUrl, pfpLoading }}>
        <SubscribeCtx.Provider
          value={{
            featuresLoading,
            setFeaturesLoading,
            authorized,
            setAuthorized,
          }}
        >
          {children}
        </SubscribeCtx.Provider>
      </ProfilePicCtx.Provider>
    </AuthCtx.Provider>
  );
}

export function AuthContext() {
  return useContext(AuthCtx);
}

export function ProfilePicContext() {
  return useContext(ProfilePicCtx);
}

export function SubscribeContext() {
  return useContext(SubscribeCtx);
}
