import React from 'react';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import * as compress from 'lz-string';
import {
  IAuthenticationContext,
  useAuthenticationContext,
} from '../hooks/useAuthenticationContext';
import deepEqual from 'fast-deep-equal/es6';
import { useDebounce } from 'usehooks-ts';

interface AppContextState {
  authenticationContext: IAuthenticationContext;
  setUrlParam: (key: string, value: any) => void;
  getUrlParam: <T>(key: string) => T | undefined;
}

const defaultAppContextState = {
  authenticationContext: { isAuthenticated: false, user: null },
  setUrlParam: (key: string, value: any) => {},
  getUrlParam: <T,>(key: string): T | undefined => undefined,
};

const AppContext = createContext<AppContextState>(defaultAppContextState);
export const useAppContext = () => useContext(AppContext);

const AppProvider: FC = ({ children }) => {
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

  const setUrlParam = useCallback(
    (key: string, value: {} | undefined): void => {
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
    },
    [],
  );

  const getUrlParam = useCallback(<T,>(key: string): T | undefined => {
    const param = stateUrlParamsRef.current[key];
    if (param) {
      return param as T;
    }
  }, []);

  const debouncedStateUrlParams = useDebounce(stateUrlParams, 1000);
  useEffect(() => {
    if ((Object.keys(debouncedStateUrlParams).length ?? 0) > 0) {
      setUrlParams(
        {
          state: compress.compressToEncodedURIComponent(
            JSON.stringify(debouncedStateUrlParams),
          ),
        },
        { replace: true },
      );
    } else {
      setUrlParams({}, { replace: true });
    }
  }, [debouncedStateUrlParams, setUrlParams]);

  const appContextProviderValue = {
    authenticationContext,
    setUrlParam,
    getUrlParam,
  };

  return (
    <AppContext.Provider value={appContextProviderValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
