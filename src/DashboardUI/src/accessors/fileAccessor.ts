import { IMsalContext } from '@azure/msal-react';
import { ApplicationDocumentUploadSasTokenRequest } from '../data-contracts/ApplicationDocumentUploadSasTokenRequest';
import { ApplicationDocumentUploadSasTokenResponse } from '../data-contracts/ApplicationDocumentUploadSasTokenResponse';
import westDaatApi from './westDaatApi';

export const generateSasTokens = async (
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
