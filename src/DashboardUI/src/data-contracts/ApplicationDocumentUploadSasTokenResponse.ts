import { FileSasTokenResponseBase } from './FileSasTokenResponseBase';
import { SasTokenDetails } from './SasTokenDetails';

export interface ApplicationDocumentUploadSasTokenResponse extends FileSasTokenResponseBase {
  sasTokens: SasTokenDetails[];
}
