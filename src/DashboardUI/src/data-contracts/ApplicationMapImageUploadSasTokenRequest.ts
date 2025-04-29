import { FileSasTokenRequestBase } from './FileSasTokenRequestBase';


export interface ApplicationMapImageUploadSasTokenRequest extends FileSasTokenRequestBase {
  $type: 'ApplicationMapImageUploadSasTokenRequest';
  waterConservationApplicationId: string;
}
