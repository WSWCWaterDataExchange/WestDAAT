import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { PartialPolygonData } from '../data-contracts/CombinedPolygonData';
import { convertWktToGeometry } from './geometryWktConverter';

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
