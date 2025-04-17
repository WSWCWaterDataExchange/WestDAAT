import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { MapPoint } from './MapPoint';
import { MapPolygon } from './MapPolygon';

export interface ReviewerEstimateConsumptiveUseRequest extends ApplicationStoreRequestBase {
  $type: 'ReviewerEstimateConsumptiveUseRequest';
  waterConservationApplicationId: string;
  polygons: MapPolygon[];
  controlLocation: MapPoint;
  updateEstimate: boolean;
}
