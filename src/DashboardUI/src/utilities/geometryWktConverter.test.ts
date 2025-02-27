import { GeometryCollection, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'geojson';
import { convertGeometryToWkt, convertWktToGeometry } from './geometryWktConverter';

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

const multiLineString: MultiLineString = {
  type: 'MultiLineString',
  coordinates: [
    [
      [0, 0],
      [1, 1],
    ],
    [
      [2, 2],
      [3, 3],
    ],
  ],
};

const multiPolygon: MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [filledPolygon.coordinates, polygonWithHoles.coordinates],
};

const geometryCollection: GeometryCollection = {
  type: 'GeometryCollection',
  geometries: [point, lineString, polygonWithHoles],
};

describe('geometryWktConverter', () => {
  describe('convertGeometryToWkt', () => {
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

    test('converts multi line string to WKT', () => {
      expect(convertGeometryToWkt(multiLineString)).toBe('MULTILINESTRING ((0 0, 1 1), (2 2, 3 3))');
    });

    test('converts multi polygon to WKT', () => {
      expect(convertGeometryToWkt(multiPolygon)).toBe(
        'MULTIPOLYGON (((0 0, 1 0, 1 1, 0 1, 0 0)), ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1)))',
      );
    });

    test('converts geometry collection to WKT', () => {
      expect(convertGeometryToWkt(geometryCollection)).toBe(
        'GEOMETRYCOLLECTION (' +
          'POINT (0 0), ' +
          'LINESTRING (0 0, 0 1, 1 2), ' +
          'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1))' +
          ')',
      );
    });
  });

  describe('convertWktToGeometry', () => {
    it('should convert WKT to point', () => {
      expect(convertWktToGeometry('POINT (0 0)')).toEqual(point);
    });

    it('should convert Extended WKT to point', () => {
      const convertedPoint = convertWktToGeometry('SRID=4326;POINT (0 0)') as Point;

      expect(convertedPoint.type).toEqual(point.type);
      expect(convertedPoint.coordinates).toEqual(point.coordinates);
      expect((convertedPoint as any).crs).toEqual({ type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4326' } });
    });

    it('should convert WKT to linestring', () => {
      expect(convertWktToGeometry('LINESTRING (0 0, 0 1, 1 2)')).toEqual(lineString);
    });

    it('should convert WKT to filled polygon', () => {
      expect(convertWktToGeometry('POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))')).toEqual(filledPolygon);
    });

    it('should convert WKT to polygon with holes', () => {
      expect(
        convertWktToGeometry('POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1))'),
      ).toEqual(polygonWithHoles);
    });

    it('should convert WKT to multi point', () => {
      expect(convertWktToGeometry('MULTIPOINT ((0 0), (0 1), (1 2))')).toEqual(multiPoint);
    });

    it('should convert WKT to multi linestring', () => {
      expect(convertWktToGeometry('MULTILINESTRING ((0 0, 1 1), (2 2, 3 3))')).toEqual(multiLineString);
    });

    it('should convert WKT to multi polygon', () => {
      expect(
        convertWktToGeometry(
          'MULTIPOLYGON (((0 0, 1 0, 1 1, 0 1, 0 0)), ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1)))',
        ),
      ).toEqual(multiPolygon);
    });

    it('should convert WKT to geometry collection', () => {
      expect(
        convertWktToGeometry(
          'GEOMETRYCOLLECTION (' +
            'POINT (0 0), ' +
            'LINESTRING (0 0, 0 1, 1 2), ' +
            'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0), (0.1 0.1, 0.9 0.1, 0.9 0.9, 0.1 0.9, 0.1 0.1))' +
            ')',
        ),
      ).toEqual(geometryCollection);
    });
  });
});
