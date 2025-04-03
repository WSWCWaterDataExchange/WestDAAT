import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface EstimateConsumptiveUseResponse {
  cumulativeTotalEtInAcreFeet: number;
  conservationPayment: number | undefined;
  dataCollections: PolygonEtDataCollection[];
}
