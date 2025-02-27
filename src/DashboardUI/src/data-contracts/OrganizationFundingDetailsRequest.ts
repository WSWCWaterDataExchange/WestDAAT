import { OrganizationLoadRequestBase } from './OrganizationLoadRequestBase';

export interface OrganizationFundingDetailsRequest extends OrganizationLoadRequestBase {
  $type: 'OrganizationFundingDetailsRequest';
  waterRightNativeId: string;
}
