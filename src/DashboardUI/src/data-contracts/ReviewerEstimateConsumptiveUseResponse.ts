import { PointEtDataCollection } from './PointEtDataCollection';
import { PolygonEtDataCollection } from './PolygonEtDataCollection';

export interface ReviewerEstimateConsumptiveUseResponse {
  cumulativeTotalEtInAcreFeet: number;
  cumulativeNetEtInAcreFeet: number;
  conservationPayment: number;
  dataCollections: PolygonEtDataCollection[];
  controlDataCollection: PointEtDataCollection;
}
