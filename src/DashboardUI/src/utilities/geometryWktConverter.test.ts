import { LineString, MultiPoint, Point, Polygon } from 'geojson';
import { convertGeometryToWkt } from './geometryWktConverter';

describe('geometryWktConverter', () => {
  describe('convertGeometryToWkt', () => {
    // test cases based on examples from https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry
    const point: Point = {
      type: 'Point',
      coordinates: [0, 0],
    };

    const emptyPoint: Point = {
      type: 'Point',
      coordinates: [],
    };

    const lineString: LineString = {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [0, 1],
        [1, 2],
      ],
    };

    const emptyLineString: LineString = {
      type: 'LineString',
      coordinates: [],
    };

    const filledPolygon: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    };

    const polygonWithHoles: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
        [
          [0.1, 0.1],
          [0.9, 0.1],
          [0.9, 0.9],
          [0.1, 0.9],
          [0.1, 0.1],
        ],
      ],
    };

    const emptyPolygon: Polygon = {
      type: 'Polygon',
      coordinates: [],
    };

    const multiPoint: MultiPoint = {
      type: 'MultiPoint',
      coordinates: [
        [0, 0],
        [0, 1],
        [1, 2],
      ],
    };

    test('converts point to WKT', () => {
      expect(convertGeometryToWkt(point)).toBe('POINT (0 0)');
    });

    test('converts empty point to WKT', () => {
      expect(convertGeometryToWkt(emptyPoint)).toBe('POINT EMPTY');
    });

    test('converts line string to WKT', () => {
      expect(convertGeometryToWkt(lineString)).toBe('LINESTRING (0 0, 0 1, 1 2)');
    });

    test('converts empty line string to WKT', () => {
      expect(convertGeometryToWkt(emptyLineString)).toBe('LINESTRING EMPTY');
    });

    test('converts filled polygon to WKT', () => {
      expect(convertGeometryToWkt(filledPolygon)).toBe('POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))');
    });

    test('converts polygon with holes to WKT', () => {
      expect(convertGeometryToWkt(polygonWithHoles)).toBe(
        'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1))',
      );
    });

    test('converts empty polygon to WKT', () => {
      expect(convertGeometryToWkt(emptyPolygon)).toBe('POLYGON EMPTY');
    });

    test('converts multi point to WKT', () => {
      expect(convertGeometryToWkt(multiPoint)).toBe('MULTIPOINT ((0 0), (0 1), (1 2))');
    });
  });
});
