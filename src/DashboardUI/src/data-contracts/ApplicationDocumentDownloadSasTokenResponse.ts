import { FileSasTokenResponseBase } from './FileSasTokenResponseBase';

export interface ApplicationDocumentDownloadSasTokenResponse extends FileSasTokenResponseBase {
  sasToken: string;
  fileName: string;
}
