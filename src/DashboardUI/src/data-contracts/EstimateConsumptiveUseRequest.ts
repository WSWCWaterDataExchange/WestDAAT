import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';
import { MapPolygon } from './MapPolygon';

export interface EstimateConsumptiveUseRequest extends ApplicationStoreRequestBase {
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: MapPolygon[];
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
