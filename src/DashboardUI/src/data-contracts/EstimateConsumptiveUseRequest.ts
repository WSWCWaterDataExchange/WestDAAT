import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';

export interface EstimateConsumptiveUseRequest extends ApplicationStoreRequestBase {
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: string[]; // polygons in wkt format
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
