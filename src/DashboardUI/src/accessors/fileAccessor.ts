import { IMsalContext } from '@azure/msal-react';
import { ApplicationDocumentDownloadSasTokenRequest } from '../data-contracts/ApplicationDocumentDownloadSasTokenRequest';
import { ApplicationDocumentDownloadSasTokenResponse } from '../data-contracts/ApplicationDocumentDownloadSasTokenResponse';
import { ApplicationDocumentUploadSasTokenRequest } from '../data-contracts/ApplicationDocumentUploadSasTokenRequest';
import { ApplicationDocumentUploadSasTokenResponse } from '../data-contracts/ApplicationDocumentUploadSasTokenResponse';
import westDaatApi from './westDaatApi';
import { ApplicationMapImageUploadSasTokenRequest } from '../data-contracts/ApplicationMapImageUploadSasTokenRequest';
import { ApplicationMapImageUploadSasTokenResponse } from '../data-contracts/ApplicationMapImageUploadSasTokenResponse';

export const generateDocumentUploadSasTokens = async (
  msalContext: IMsalContext,
  fileCount: number,
): Promise<ApplicationDocumentUploadSasTokenResponse> => {
  const api = await westDaatApi(msalContext);

  const request: ApplicationDocumentUploadSasTokenRequest = {
    $type: 'ApplicationDocumentUploadSasTokenRequest',
    fileUploadCount: fileCount,
  };

  const { data } = await api.post('Files/GenerateSasToken', request);
  return data;
};

export const generateMapImageUploadSasToken = async (
  msalContext: IMsalContext,
  applicationId: string,
): Promise<ApplicationMapImageUploadSasTokenResponse> => {
  const api = await westDaatApi(msalContext);

  const request: ApplicationMapImageUploadSasTokenRequest = {
    $type: 'ApplicationMapImageUploadSasTokenRequest',
    waterConservationApplicationId: applicationId,
  };

  const { data } = await api.post('Files/GenerateSasToken', request);
  return data;
};

export const generateDocumentDownloadSasToken = async (
  msalContext: IMsalContext,
  documentId: string,
): Promise<ApplicationDocumentDownloadSasTokenResponse> => {
  const api = await westDaatApi(msalContext);

  const request: ApplicationDocumentDownloadSasTokenRequest = {
    $type: 'ApplicationDocumentDownloadSasTokenRequest',
    waterConservationApplicationDocumentId: documentId,
  };

  const { data } = await api.post('Files/GenerateSasToken', request);
  return data;
};
