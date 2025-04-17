import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';
import { MapPolygon } from './MapPolygon';

export interface ApplicantEstimateConsumptiveUseRequest extends ApplicationStoreRequestBase {
  $type: 'ApplicantEstimateConsumptiveUseRequest';
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: MapPolygon[];
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
