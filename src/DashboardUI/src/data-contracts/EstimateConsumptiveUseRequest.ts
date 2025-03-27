import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';
import { StorePolygonDetails } from './StorePolygonDetails';

export interface EstimateConsumptiveUseRequest extends ApplicationStoreRequestBase {
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: StorePolygonDetails[];
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
