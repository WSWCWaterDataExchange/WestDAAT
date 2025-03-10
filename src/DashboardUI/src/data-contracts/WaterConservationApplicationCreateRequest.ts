import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';

export interface WaterConservationApplicationCreateRequest extends ApplicationStoreRequestBase {
  fundingOrganizationId: string;
  waterRightNativeId: string;
}
