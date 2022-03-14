import { createContext, FC, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface User {
  username: string;
}

interface AppContextState {
  user: User | null,
  setUser: (user: User | null) => void,

  setUrlParam: (key: string, value: any) => void,
  getUrlParam: <T, >(key: string) => T | undefined,
};

let defaultAppContextState = {
  user: null,
  setUser: (user: User | null) => { },

  setUrlParam: (key: string, value: any) => { },
  getUrlParam: <T,>(key: string): T | undefined => undefined,
}

export const AppContext = createContext<AppContextState>(defaultAppContextState);

const AppProvider: FC = ({ children }) => {

  let [urlParams, setUrlParams] = useSearchParams();

  const [user, setUser] = useState(null as User | null);

  const initUrlParams = () => {
    const stateStr =urlParams.get("state");
    if(stateStr)
    {
      return JSON.parse(stateStr) as Record<string, string>;
    }
    return {} as Record<string, string>;
  }

  const [stateUrlParams, setStateUrlParams] = useState(initUrlParams());

  const setUrlParam = useCallback((key: string, value: any): void => {
    setStateUrlParams(s=>({
      ...s,
      [key]: JSON.stringify(value)
    }))
  }, [])
  
  const getUrlParam = useCallback(<T,>(key: string): T | undefined => {
    var param = stateUrlParams[key];
    if(param){
      return JSON.parse(param) as T;
    }
  }, [stateUrlParams])

  useEffect(() => {
    setUrlParams({state: JSON.stringify(stateUrlParams)})
  }, [stateUrlParams, setUrlParams])

  const appContextProviderValue = {
    user,
    setUser,
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
