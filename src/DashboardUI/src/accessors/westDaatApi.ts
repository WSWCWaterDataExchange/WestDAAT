import { useMsal } from '@azure/msal-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_WEBAPI_URL;
const { instance: msalContext, accounts } = useMsal();

const useWestDaatApi = () => {
  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use(
    (config) => {
      const tokenRequest = {
        scopes: ['user.read'],
        account: accounts[0],
      };

      msalContext
        ?.acquireTokenSilent(tokenRequest)
        .then((response) => {
          config.headers['Authorization'] = `Bearer ${response.idToken}`;
        })
        .catch(() => {
          msalContext
            .acquireTokenPopup(tokenRequest)
            .then((response) => {
              config.headers['Authorization'] = `Bearer ${response.idToken}`;
            })
            .catch((error) => {
              // Acquire token interactive failure
              console.error(error);
            });
        });

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  return api;
};

export default useWestDaatApi;
