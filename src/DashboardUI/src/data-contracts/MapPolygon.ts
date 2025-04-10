import { DrawToolType } from './DrawToolType';

export interface MapPolygon {
  waterConservationApplicationEstimateLocationId: string | null;
  polygonWkt: string;
  drawToolType: DrawToolType;
}
