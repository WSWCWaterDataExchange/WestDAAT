import {
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
