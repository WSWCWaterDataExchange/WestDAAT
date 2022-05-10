import { createContext, FC, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as compress from "lz-string";
import { IAuthenticationContext, useAuthenticationContext } from "./hooks/useAuthenticationContext";

interface AppContextState {
  authorizationContext: IAuthenticationContext,
  setUrlParam: (key: string, value: any) => void,
  getUrlParam: <T, >(key: string) => T | undefined
}

let defaultAppContextState = {
  authorizationContext: { isAuthenticated: false, user: null },
  setUrlParam: (key: string, value: any) => { },
  getUrlParam: <T,>(key: string): T | undefined => undefined
}

export const AppContext = createContext<AppContextState>(defaultAppContextState);

const AppProvider: FC = ({ children }) => {

  let [urlParams, setUrlParams] = useSearchParams();

  const authorizationContext = useAuthenticationContext();

  const initUrlParams = () => {
    const stateStr = urlParams.get("state");
    if (stateStr) {
      const decompressed = compress.decompressFromEncodedURIComponent(stateStr);
      if (decompressed) {
        return JSON.parse(decompressed) as Record<string, any>;
      }
    }
    return {};
  }

  const [stateUrlParams, setStateUrlParams] = useState(initUrlParams());

  const setUrlParam = useCallback((key: string, value: {} | undefined): void => {
    setStateUrlParams(s => {
      const updatedValues = { ...s };
      if (value === undefined) {
        delete updatedValues[key]
      } else {
        updatedValues[key] = value;
      }
      return updatedValues;
    })
  }, [])

  const getUrlParam = useCallback(<T,>(key: string): T | undefined => {
    var param = stateUrlParams[key];
    if (param) {
      return param as T;
    }
  }, [stateUrlParams])

  useEffect(() => {
    if ((Object.keys(stateUrlParams).length ?? 0) > 0) {
      setUrlParams({ state: compress.compressToEncodedURIComponent(JSON.stringify(stateUrlParams)) })
    } else {
      setUrlParams({});
    }

  }, [stateUrlParams, setUrlParams])

  const appContextProviderValue = {
    authorizationContext,
    setUrlParam,
    getUrlParam
  };

  return (
    <AppContext.Provider value={appContextProviderValue}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
