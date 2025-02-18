import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';

export interface WaterConservationApplicationCreateRequest extends ApplicationStoreRequestBase {
  waterRightNativeId: string;
}
