import { FileSasTokenRequestBase } from './FileSasTokenRequestBase';

export interface ApplicationDocumentUploadSasTokenRequest extends FileSasTokenRequestBase {
  $type: 'ApplicationDocumentUploadSasTokenRequest';
  fileUploadCount: number;
}
