import { PolygonEtDatapoint } from './PolygonEtDatapoint';

export interface PolygonEtDataCollection {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  averageYearlyTotalEtInInches: number;
  averageYearlyTotalEtInAcreFeet: number;
  datapoints: PolygonEtDatapoint[];
}
