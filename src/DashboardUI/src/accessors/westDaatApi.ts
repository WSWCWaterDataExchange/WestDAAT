import { IMsalContext } from '@azure/msal-react';
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_WEBAPI_URL;

const westDaatApi = async (msalContext?: IMsalContext): Promise<AxiosInstance> => {
  const api = axios.create({
    baseURL: API_URL,
  });

  // If auth is not required, or user not logged in, don't add auth headers.
  if (!msalContext || msalContext.accounts.length === 0) {
    return api;
  }

  const tokenResponse = await msalContext.instance.acquireTokenSilent({
    scopes: ['openid', 'offline_access', process.env.REACT_APP_AUTH_CLIENT_ID ?? ''],
  });

  api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.accessToken}`;

  return api;
};

export default westDaatApi;
