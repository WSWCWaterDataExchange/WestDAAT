import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface ApplicantEstimateConsumptiveUseResponse {
  cumulativeTotalEtInAcreFeet: number;
  conservationPayment: number | undefined;
  dataCollections: PolygonEtDataCollection[];
}
