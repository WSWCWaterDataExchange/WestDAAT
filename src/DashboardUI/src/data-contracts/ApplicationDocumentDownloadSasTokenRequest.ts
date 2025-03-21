import { FileSasTokenRequestBase } from './FileSasTokenRequestBase';

export interface ApplicationDocumentDownloadSasTokenRequest extends FileSasTokenRequestBase {
  $type: 'ApplicationDocumentDownloadSasTokenRequest';
  waterConservationApplicationDocumentId: string;
}
