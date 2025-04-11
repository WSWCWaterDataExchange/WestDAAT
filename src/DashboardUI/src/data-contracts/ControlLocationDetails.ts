import { ControlLocationWaterMeasurementDetails } from './ControlLocationWaterMeasurementDetails';

export interface ControlLocationDetails {
  id: string;
  pointWkt: string;
  waterMeasurements: ControlLocationWaterMeasurementDetails[];
}
