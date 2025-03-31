import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import { MapSelectionPolygonData, PartialPolygonData } from '../data-contracts/CombinedPolygonData';
import { convertGeometryToWkt, convertWktToGeometry } from './geometryWktConverter';
import { convertSquareMetersToAcres } from './valueConverters';
import areaInSquareMeters from '@turf/area';
import { initializeFeaturePropertyFromDrawToolType, parseDrawToolTypeFromFeature } from './customMapShapesUtility';
import { DrawToolType } from '../data-contracts/DrawToolType';

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

export const fromGeometryFeatureToMapSelectionPolygonData = (
  polygonFeature: Feature<Geometry, GeoJsonProperties>,
): MapSelectionPolygonData => ({
  polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
  drawToolType: parseDrawToolTypeFromFeature(polygonFeature),
  acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
});
