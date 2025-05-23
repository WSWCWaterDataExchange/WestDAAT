import { Point } from 'geojson';
import { GeometryEtDatapoint } from './GeometryEtDatapoint';
import { DrawToolType } from './DrawToolType';

type FullPolygonData = {
  waterConservationApplicationEstimateLocationId: string;
  polygonWkt: string;
  drawToolType: DrawToolType;
  centerPoint: Point;
  fieldName: string;
  acreage: number;
  averageYearlyTotalEtInInches: number;
  averageYearlyTotalEtInAcreFeet: number;
  averageYearlyNetEtInInches: number | null;
  averageYearlyNetEtInAcreFeet: number | null;
  datapoints: GeometryEtDatapoint[];
  additionalDetails: string;
};

export type PartialPolygonData = Partial<FullPolygonData>;

export type MapSelectionPolygonData = Pick<FullPolygonData, 'polygonWkt' | 'drawToolType' | 'acreage'> &
  Pick<PartialPolygonData, 'waterConservationApplicationEstimateLocationId'>;
