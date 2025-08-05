"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  retry,
  fetchUser,
  verifyOffer,
  fetchOffer,
  fetchOrders,
  fetchProfilePicture,
} from "@/lib/authContextLogic";
import { toast } from "react-hot-toast";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [purchasedOffer, setPurchasedOffer] = useState([]);
  const [orders, setOrders] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const firstRender = useRef(true);

  const domain = "https://coliha-server.onrender.com";

  const handleLogout = () => {
    setLogged(false);
    setLoading(false);
    firstRender.current = false;
    localStorage?.removeItem?.("accessToken");
  };

  const handleLogin = () => {
    setLogged(true);
    setLoading(false);
    firstRender.current = false;
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setLogged(false);

        const user = await retry(
          () =>
            fetchUser?.({
              domain,
              setUser,
              verifyOffer: (user) =>
                verifyOffer?.({
                  user,
                  domain,
                  setUser,
                  fetchOffer: (user) =>
                    fetchOffer?.({
                      user,
                      domain,
                      setPurchasedOffer,
                      fetchOrders: (user) =>
                        fetchOrders?.({
                          user,
                          domain,
                          setOrders,
                          fetchProfilePicture: (user) =>
                            fetchProfilePicture?.({
                              user,
                              domain,
                              setImageUrl,
                              onLogin: handleLogin,
                              on401: handleLogout,
                            }),
                          on401: handleLogout,
                        }),
                      on401: handleLogout,
                    }),
                  fetchProfilePicture: (user) =>
                    fetchProfilePicture?.({
                      user,
                      domain,
                      setImageUrl,
                      onLogin: handleLogin,
                      on401: handleLogout,
                    }),
                  on401: handleLogout,
                }),
              on401: handleLogout,
            }),
          3,
          1000,
          handleLogout
        );
      } catch (err) {
        if (!firstRender?.current) {
          toast?.error?.("Oops! Something went wrong. Please try again.");
        }
        handleLogout();
      }
    };

    init();
  }, [refresh]);

  return (
    <AuthCtx.Provider
      value={{
        logged,
        setLogged,
        loading,
        setLoading,
        user,
        setUser,
        purchasedOffer,
        setPurchasedOffer,
        orders,
        setOrders,
        imageUrl,
        setImageUrl,
        refresh,
        setRefresh,
        domain,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function AuthContext() {
  return useContext(AuthCtx);
}
