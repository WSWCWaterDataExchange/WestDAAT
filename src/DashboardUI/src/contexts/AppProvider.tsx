import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as compress from 'lz-string';
import { IAuthenticationContext, useAuthenticationContext } from '../hooks/useAuthenticationContext';
import { useDebounce } from '@react-hook/debounce';
import deepEqual from 'fast-deep-equal/es6';

interface AppContextState {
  authenticationContext: IAuthenticationContext;
  setUrlParam: (key: string, value: any) => void;
  getUrlParam: <T>(key: string) => T | undefined;
}

const defaultAppContextState = {
  authenticationContext: { isAuthenticated: false, user: null, authenticationComplete: false },
  setUrlParam: () => {},
  getUrlParam: <T,>(): T | undefined => undefined,
};

const AppContext = createContext<AppContextState>(defaultAppContextState);
export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [urlParams, setUrlParams] = useSearchParams();
  const authenticationContext = useAuthenticationContext();

  const initUrlParams = useMemo(() => {
    const stateStr = urlParams.get('state');
    if (stateStr) {
      const decompressed = compress.decompressFromEncodedURIComponent(stateStr);
      if (decompressed) {
        return JSON.parse(decompressed) as Record<string, any>;
      }
    }
    return {};
  }, [urlParams]);

  const [stateUrlParams, setStateUrlParams] = useState(initUrlParams);
  const stateUrlParamsRef = useRef(stateUrlParams);

  const setUrlParam = useCallback((key: string, value: Record<string, any> | undefined): void => {
    setStateUrlParams((s) => {
      const updated = !deepEqual(s[key], value);
      if (!updated) return s;
      const updatedValues = { ...s };
      if (value === undefined) {
        delete updatedValues[key];
      } else {
        updatedValues[key] = value;
      }
      stateUrlParamsRef.current = updatedValues;
      return updatedValues;
    });
  }, []);

  const getUrlParam = useCallback(<T,>(key: string): T | undefined => {
    const param = stateUrlParamsRef.current[key];
    if (param) {
      return param as T;
    }
  }, []);

  const [debouncedStateUrlParams] = useDebounce(stateUrlParams, 1000);
  useEffect(() => {
    if ((Object.keys(debouncedStateUrlParams).length ?? 0) > 0) {
      setUrlParams(
        {
          state: compress.compressToEncodedURIComponent(JSON.stringify(debouncedStateUrlParams)),
        },
        { replace: true },
      );
    } else {
      // Wait for MSAL to complete authentication before clearing the state.
      // On login redirect, state is sent as a query parameter which gets
      // cleared after authentication automatically.
      if (authenticationContext.authenticationComplete) {
        setUrlParams({}, { replace: true });
      }
    }
  }, [debouncedStateUrlParams, setUrlParams]);

  const appContextProviderValue = {
    authenticationContext,
    setUrlParam,
    getUrlParam,
  };

  return <AppContext.Provider value={appContextProviderValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
