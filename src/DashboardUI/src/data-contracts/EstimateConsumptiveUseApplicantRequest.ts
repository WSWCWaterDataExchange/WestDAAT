import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';
import { MapPolygon } from './MapPolygon';

export interface EstimateConsumptiveUseApplicantRequest extends ApplicationStoreRequestBase {
  $type: 'EstimateConsumptiveUseApplicantRequest';
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: MapPolygon[];
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
