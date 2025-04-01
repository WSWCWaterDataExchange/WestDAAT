import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface EstimateConsumptiveUseResponse {
  sumAverageYearlyTotalEtInAcreFeet: number;
  conservationPayment: number | undefined;
  dataCollections: PolygonEtDataCollection[];
}
