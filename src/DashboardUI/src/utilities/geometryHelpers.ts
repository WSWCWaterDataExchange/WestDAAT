import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { circle } from '@turf/circle';
import { distance } from '@turf/distance';
import { featureCollection } from '@turf/helpers';
import intersect from '@turf/intersect';
import truncate from '@turf/truncate';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon, Position } from 'geojson';
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
  const circleFeature = circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 100 });
  // `circle` generates coordinates with up to 14 decimal places of precision.
  // 7 decimals is worth up to 1.1cm of precision, which is more than enough for our purposes.
  return truncate(circleFeature, { precision: 7 });
};

export const doPolygonsIntersect = (polygons: Feature<Geometry, GeoJsonProperties>[]): boolean => {
  for (let i = 0; i < polygons.length; i++) {
    for (let j = i + 1; j < polygons.length; j++) {
      const p1 = polygons[i] as Feature<Polygon, GeoJsonProperties>;
      const p2 = polygons[j] as Feature<Polygon, GeoJsonProperties>;

      const intersection = intersect(featureCollection([p1, p2]));

      if (intersection) {
        return true;
      }
    }
  }

  return false;
};

export const doesPointIntersectWithPolygon = (
  point: Feature<Point, GeoJsonProperties>,
  polygon: Feature<Polygon, GeoJsonProperties>,
): boolean => {
  return booleanPointInPolygon(point, polygon);
};
