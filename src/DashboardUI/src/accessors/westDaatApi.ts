import { IMsalContext } from '@azure/msal-react';
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_WEBAPI_URL;

const westDaatApi = async (msalContext: IMsalContext): Promise<AxiosInstance> => {
  const api = axios.create({
    baseURL: API_URL,
  });

  // User not logged in. Don't set auth header.
  if (msalContext.accounts.length === 0) {
    return api;
  }

  const tokenResponse = await msalContext.instance.acquireTokenSilent({
    scopes: ['openid', 'offline_access', process.env.REACT_APP_AUTH_CLIENT_ID ?? ''],
  });

  api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.accessToken}`;

  return api;
};

export default westDaatApi;
