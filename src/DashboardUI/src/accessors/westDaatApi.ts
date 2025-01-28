import { IMsalContext } from '@azure/msal-react';
import axios, { AxiosInstance } from 'axios';
import { loginRequest } from '../authConfig';

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
    scopes: loginRequest.scopes,
  });

  api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.accessToken}`;

  return api;
};

export default westDaatApi;
