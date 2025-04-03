import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface EstimateConsumptiveUseApplicantResponse {
  cumulativeTotalEtInAcreFeet: number;
  conservationPayment: number | undefined;
  dataCollections: PolygonEtDataCollection[];
}
