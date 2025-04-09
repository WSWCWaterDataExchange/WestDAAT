import { GeometryEtDatapoint } from './GeometryEtDatapoint';

export interface PolygonEtDataCollection {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  averageYearlyTotalEtInInches: number;
  averageYearlyTotalEtInAcreFeet: number;
  averageYearlyNetEtInInches: number;
  averageYearlyNetEtInAcreFeet: number;
  datapoints: GeometryEtDatapoint[];
}
