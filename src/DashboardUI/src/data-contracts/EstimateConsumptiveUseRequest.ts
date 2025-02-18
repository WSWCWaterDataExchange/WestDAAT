import { CompensationRateUnits } from './CompensationRateUnits';

export interface EstimateConsumptiveUseRequest {
  waterConservationApplicationId: string;
  waterRightNativeId: string;
  polygons: string[]; // polygons in wkt format
  model: number;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}
