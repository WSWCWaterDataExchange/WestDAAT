import {
  FeatureCollection,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

export const pointMock: Point = {
  type: 'Point',
  coordinates: [0, 0],
};

export const lineStringMock: LineString = {
  type: 'LineString',
  coordinates: [
    [0, 0],
    [0, 1],
    [1, 2],
  ],
};

export const polygonMock: Polygon = {
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

const polygonWithHolesMock: Polygon = {
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

export const multiPointMock: MultiPoint = {
  type: 'MultiPoint',
  coordinates: [
    [0, 0],
    [0, 1],
    [1, 2],
  ],
};

export const multiLineStringMock: MultiLineString = {
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

export const multiPolygonMock: MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [polygonMock.coordinates, polygonWithHolesMock.coordinates],
};

export const geometryCollectionMock: GeometryCollection = {
  type: 'GeometryCollection',
  geometries: [pointMock, lineStringMock, polygonMock],
};

export const geometryCollectionExtendedMock: GeometryCollection = {
  type: 'GeometryCollection',
  geometries: [
    pointMock,
    lineStringMock,
    polygonMock,
    polygonWithHolesMock,
    multiPointMock,
    multiLineStringMock,
    multiPolygonMock,
  ],
};
