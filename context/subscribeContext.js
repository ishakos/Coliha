"use client";

import { createContext, useContext, useState } from "react";

const SubscribeCtx = createContext(null);

export function SubscribeProvider({ children }) {
  const [featuresPageLoading, setFeaturesPageLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  return (
    <SubscribeCtx.Provider
      value={{
        featuresPageLoading,
        setFeaturesPageLoading,
        authorized,
        setAuthorized,
      }}
    >
      {children}
    </SubscribeCtx.Provider>
  );
}

export function SubscribeContext() {
  return useContext(SubscribeCtx);
}
