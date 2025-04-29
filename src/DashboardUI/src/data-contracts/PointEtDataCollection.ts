import { GeometryEtDatapoint } from './GeometryEtDatapoint';

export interface PointEtDataCollection {
  waterConservationApplicationEstimateControlLocationId: string;
  pointWkt: string;
  averageYearlyTotalEtInInches: number;
  datapoints: GeometryEtDatapoint[];
}
