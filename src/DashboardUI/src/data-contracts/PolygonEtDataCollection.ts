import { PolygonEtDatapoint } from './PolygonEtDatapoint';

export interface PolygonEtDataCollection {
  polygonWkt: string;
  averageYearlyEtInInches: number;
  averageYearlyEtInAcreFeet: number;
  datapoints: PolygonEtDatapoint[];
}
