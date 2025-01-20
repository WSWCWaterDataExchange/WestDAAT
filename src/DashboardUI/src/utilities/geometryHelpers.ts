import { circle } from '@turf/circle';
import { distance } from '@turf/distance';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Polygon, Position } from 'geojson';
import mapboxgl from 'mapbox-gl';

export function getLatsLongsFromFeatureCollection(featureCollection: FeatureCollection<Geometry, GeoJsonProperties>) {
  let positions: Position[] = [];

  featureCollection.features.forEach((x) => {
    if (x.geometry.type === 'Point') {
      positions.push(x.geometry.coordinates);
    } else if (x.geometry.type === 'MultiPoint') {
      positions = positions.concat(x.geometry.coordinates);
    } else if (x.geometry.type === 'Polygon') {
      x.geometry.coordinates.forEach((y) => {
        positions = positions.concat(y);
      });
    } else if (x.geometry.type === 'MultiPolygon') {
      x.geometry.coordinates.forEach((y) => {
        y.forEach((z) => {
          positions = positions.concat(z);
        });
      });
    }
  });

  return positions.map((a) => new mapboxgl.LngLat(a[0], a[1]));
}

export const generateCircleWithRadiusFromCenterPointToEdgePoint = (
  circleCenterPoint: number[],
  circleEdgePoint: number[],
): Feature<Polygon, GeoJsonProperties> => {
  const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
    units: 'kilometers',
  });
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 20 });
};
