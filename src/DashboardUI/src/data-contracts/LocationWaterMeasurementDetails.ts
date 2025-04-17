export interface LocationWaterMeasurementDetails {
  id: string;
  year: number;
  totalEtInInches: number;
  effectivePrecipitationInInches: number | null;
  netEtInInches: number | null;
}
