import { IMsalContext } from '@azure/msal-react';
import { ApplicationDocumentDownloadSasTokenRequest } from '../data-contracts/ApplicationDocumentDownloadSasTokenRequest';
import { ApplicationDocumentDownloadSasTokenResponse } from '../data-contracts/ApplicationDocumentDownloadSasTokenResponse';
import { ApplicationDocumentUploadSasTokenRequest } from '../data-contracts/ApplicationDocumentUploadSasTokenRequest';
import { ApplicationDocumentUploadSasTokenResponse } from '../data-contracts/ApplicationDocumentUploadSasTokenResponse';
import westDaatApi from './westDaatApi';

export const generateUploadSasTokens = async (
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

export const generateDownloadSasToken = async (
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
}