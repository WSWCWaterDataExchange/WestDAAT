import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import { MapSelectionPolygonData, PartialPolygonData } from '../data-contracts/CombinedPolygonData';
import { convertGeometryToWkt, convertWktToGeometry } from './geometryWktConverter';
import { convertSquareMetersToAcres } from './valueConverters';
import areaInSquareMeters from '@turf/area';

export const fromPartialPolygonDataToPolygonFeature = (
  item: PartialPolygonData,
): Feature<Polygon, GeoJsonProperties> => ({
  type: 'Feature',
  geometry: convertWktToGeometry(item.polygonWkt!) as Polygon,
  properties: {
    id: item.waterConservationApplicationEstimateLocationId,
    title: item.fieldName,
  },
});

export const fromGeometryFeatureToMapSelectionPolygonData = (
  polygonFeature: Feature<Geometry, GeoJsonProperties>,
): MapSelectionPolygonData => ({
  polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
  acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
});
