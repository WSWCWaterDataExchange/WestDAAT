import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface EstimateConsumptiveUseResponse {
  totalAverageYearlyEtAcreFeet: number;
  conservationPayment: number | undefined;
  dataCollections: PolygonEtDataCollection[];
}
