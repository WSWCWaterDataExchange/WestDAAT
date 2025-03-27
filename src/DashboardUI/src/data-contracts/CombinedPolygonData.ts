import { Point } from 'geojson';
import { PolygonEtDatapoint } from './PolygonEtDatapoint';
import { PolygonType } from './PolygonType';

type FullPolygonData = {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  polygonType: PolygonType;
  centerPoint: Point;
  fieldName: string;
  acreage: number;
  averageYearlyEtInInches: number;
  averageYearlyEtInAcreFeet: number;
  datapoints: PolygonEtDatapoint[];
  additionalDetails: string;
};

export type PartialPolygonData = Partial<FullPolygonData>;

export type MapSelectionPolygonData = Pick<FullPolygonData, 'polygonWkt' | 'polygonType' | 'acreage'>;
