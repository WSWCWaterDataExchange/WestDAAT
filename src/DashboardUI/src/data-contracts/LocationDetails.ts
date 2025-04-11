import { LocationWaterMeasurementDetails } from './LocationWaterMeasurementDetails';
import { DrawToolType } from './DrawToolType';

export interface LocationDetails {
  id: string;
  polygonWkt: string;
  drawToolType: DrawToolType;
  polygonAreaInAcres: number;
  additionalDetails: string | null;
  waterMeasurements: LocationWaterMeasurementDetails[];
}
