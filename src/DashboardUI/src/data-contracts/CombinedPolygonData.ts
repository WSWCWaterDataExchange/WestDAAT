import { Point } from 'geojson';
import { PolygonEtDatapoint } from './PolygonEtDatapoint';
import { DrawToolType } from './DrawToolType';

type FullPolygonData = {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  polygonType: DrawToolType;
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
