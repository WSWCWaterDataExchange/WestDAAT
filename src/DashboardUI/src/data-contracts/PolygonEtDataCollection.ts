import { GeometryEtDatapoint } from './GeometryEtDatapoint';

export interface PolygonEtDataCollection {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  averageYearlyTotalEtInInches: number;
  averageYearlyTotalEtInAcreFeet: number;
  datapoints: GeometryEtDatapoint[];
}
