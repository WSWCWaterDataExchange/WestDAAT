import { GeometryEtDatapoint } from './GeometryEtDatapoint';

export interface PolygonEtDataCollection {
  waterConservationApplicationEstimateLocationId: string | null;
  polygonWkt: string;
  averageYearlyTotalEtInInches: number;
  averageYearlyTotalEtInAcreFeet: number;
  averageYearlyNetEtInInches: number | null;
  averageYearlyNetEtInAcreFeet: number | null;
  datapoints: GeometryEtDatapoint[];
}
