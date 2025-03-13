import { PolygonEtDatapoint } from './PolygonEtDatapoint';

export interface PolygonEtDataCollection {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  averageYearlyEtInInches: number;
  averageYearlyEtInAcreFeet: number;
  datapoints: PolygonEtDatapoint[];
}
