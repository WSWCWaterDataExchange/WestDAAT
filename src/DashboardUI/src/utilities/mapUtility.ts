import { Feature, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import { MapSelectionPolygonData, PartialPolygonData } from '../data-contracts/CombinedPolygonData';
import { convertGeometryToWkt, convertWktToGeometry } from './geometryWktConverter';
import { convertSquareMetersToAcres } from './valueConverters';
import areaInSquareMeters from '@turf/area';
import { initializeFeaturePropertyFromDrawToolType, parseDrawToolTypeFromFeature } from './customMapShapesUtility';
import { DrawToolType } from '../data-contracts/DrawToolType';
import { MapSelectionPointData, PartialPointData } from '../data-contracts/CombinedPointData';

export const fromPartialPolygonDataToPolygonFeature = (
  item: PartialPolygonData,
): Feature<Polygon, GeoJsonProperties> => ({
  type: 'Feature',
  geometry: convertWktToGeometry(item.polygonWkt!) as Polygon,
  properties: {
    ...initializeFeaturePropertyFromDrawToolType(item.drawToolType ?? DrawToolType.Freeform),
    id: item.waterConservationApplicationEstimateLocationId,
    title: item.fieldName,
  },
});

export const fromPartialPointDataToPointFeature = (item: PartialPointData): Feature<Point, GeoJsonProperties> => ({
  type: 'Feature',
  geometry: convertWktToGeometry(item.pointWkt!) as Point,
  properties: {
    id: item.waterConservationApplicationEstimateControlLocationId,
  },
});

export const fromGeometryFeatureToMapSelectionPolygonData = (
  polygonFeature: Feature<Geometry, GeoJsonProperties>,
): MapSelectionPolygonData => ({
  waterConservationApplicationEstimateLocationId: polygonFeature.properties?.id,
  polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
  drawToolType: parseDrawToolTypeFromFeature(polygonFeature),
  acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
});

export const fromGeometryFeatureToMapSelectionPointData = (
  pointFeature: Feature<Geometry, GeoJsonProperties>,
): MapSelectionPointData => ({
  pointWkt: convertGeometryToWkt(pointFeature.geometry),
});
