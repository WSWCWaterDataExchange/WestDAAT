// SiteUUIDContext.tsx
import React, { createContext, useState, ReactNode } from "react";

interface SiteUUIDContextProps {
  storedSiteUUID: string;
  setStoredSiteUUID: React.Dispatch<React.SetStateAction<string>>;
}

export const SiteUUIDContext = createContext<SiteUUIDContextProps>({
  storedSiteUUID: "",
  setStoredSiteUUID: () => {},
});

interface SiteUUIDProviderProps {
  children: ReactNode;
}

export const SiteUUIDProvider: React.FC<SiteUUIDProviderProps> = ({ children }) => {
  const [storedSiteUUID, setStoredSiteUUID] = useState("");

  console.log("Context Provider - storedSiteUUID:", storedSiteUUID);

  return <SiteUUIDContext.Provider value={{ storedSiteUUID, setStoredSiteUUID }}>{children}</SiteUUIDContext.Provider>;
};
