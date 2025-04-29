import { FileSasTokenResponseBase } from './FileSasTokenResponseBase';
import { SasTokenDetails } from './SasTokenDetails';


export interface ApplicationMapImageUploadSasTokenResponse extends FileSasTokenResponseBase {
  sasToken: SasTokenDetails;
}
