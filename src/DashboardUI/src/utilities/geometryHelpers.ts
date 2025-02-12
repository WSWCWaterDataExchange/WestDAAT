import { circle } from '@turf/circle';
import { distance } from '@turf/distance';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
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
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 100 });
};

export const convertGeometryToWkt = (geometry: Geometry): string => {
  const pairWKT = (coord: Position) => {
    return `${coord[0]} ${coord[1]}`;
  };

  const linearRingWKT = (linearRing: Position[]) => {
    return linearRing.map(pairWKT).join(', ');
  };

  const polygonRingsWKT = (polygonRings: Position[][]) => {
    return polygonRings.map(linearRingWKT).map(wrapParens).join(', ');
  };

  const multiPolygonRingsWKT = (multiPolygonRings: Position[][][]) => {
    return multiPolygonRings.map(polygonRingsWKT).map(wrapParens).join(', ');
  };

  const wrapParens = (s: string) => `(${s})`;

  switch (geometry.type) {
    case 'Point': {
      const point = geometry as Point;
      return `POINT (${pairWKT(point.coordinates)})`;
    }
    case 'LineString': {
      const lineString = geometry as LineString;
      return `LINESTRING (${linearRingWKT(lineString.coordinates)})`;
    }
    case 'Polygon': {
      const polygon = geometry as Polygon;
      return `POLYGON (${polygonRingsWKT(polygon.coordinates)})`;
    }
    case 'MultiPoint': {
      const multiPoint = geometry as MultiPoint;
      return `MULTIPOINT (${linearRingWKT(multiPoint.coordinates)})`;
    }
    case 'MultiLineString': {
      const multiLineString = geometry as MultiLineString;
      return `MULTILINESTRING (${polygonRingsWKT(multiLineString.coordinates)})`;
    }
    case 'MultiPolygon': {
      const multiPolygon = geometry as MultiPolygon;
      return `MULTIPOLYGON (${multiPolygonRingsWKT(multiPolygon.coordinates)})`;
    }
    case 'GeometryCollection': {
      const geometries = geometry as GeometryCollection;
      return `GEOMETRYCOLLECTION (${geometries.geometries.map(convertGeometryToWkt).join(', ')})`;
    }
  }
};
// function stringify (gj) {
//   if (gj.type === 'Feature') {
//     gj = gj.geometry;
//   }

//   switch (gj.type) {
//     case 'MultiPolygon':
//       return 'MULTIPOLYGON (' + multiRingsWKT(gj.coordinates) + ')';
//     case 'MultiLineString':
//       return 'MULTILINESTRING (' + ringsWKT(gj.coordinates) + ')';
//     case 'GeometryCollection':
//       return 'GEOMETRYCOLLECTION (' + gj.geometries.map(stringify).join(', ') + ')';
//     default:
//       throw new Error('stringify requires a valid GeoJSON Feature or geometry object as input');
//   }
