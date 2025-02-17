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

  let tokenResponse;
  try {
    // Attempt silent token acquisition. If the refresh token is expired, this will throw an error.
    // In that case, we'll catch the error and use acquireTokenPopup to get a new token.
    tokenResponse = await msalContext.instance.acquireTokenSilent({
      scopes: loginRequest.scopes,
    });
  } catch (error: any) {
    if (error && error.name === 'InteractionRequiredAuthError') {
      tokenResponse = await msalContext.instance.acquireTokenPopup({
        scopes: loginRequest.scopes,
      });
    } else {
      throw error;
    }
  }

  api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.accessToken}`;

  return api;
};

export default westDaatApi;
