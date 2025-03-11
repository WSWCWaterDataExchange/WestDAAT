import { Point } from 'geojson';
import { PolygonEtDatapoint } from './PolygonEtDatapoint';

export interface CombinedPolygonData {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  centerPoint: Point;
  fieldName: string;
  acreage: number;
  averageYearlyEtInInches: number;
  averageYearlyEtInAcreFeet: number;
  datapoints: PolygonEtDatapoint[];
  additionalDetailsTrackedFormValue: string;
}
