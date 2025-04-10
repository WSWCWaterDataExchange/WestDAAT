import './geometryHelpers.mock';

import { Feature, GeoJsonProperties, Point, Polygon } from 'geojson';
import { doesPointExistWithinPolygon, doPolygonsIntersect } from './geometryHelpers';

describe('geometryHelpers', () => {
  describe('doPolygonsIntersect', () => {
    it('should return true if the polygons intersect', () => {
      // Arrange
      const polygon: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      };

      const polygons = [polygon, polygon];

      // Act
      const result = doPolygonsIntersect(polygons);

      expect(result).toEqual(true);
    });

    it('should return false if the polygons do not intersect', () => {
      // Arrange
      const polygon1: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      };

      const polygon2: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [2, 2],
              [2, 3],
              [3, 3],
              [3, 2],
              [2, 2],
            ],
          ],
        },
      };

      const polygons = [polygon1, polygon2];

      // Act
      const result = doPolygonsIntersect(polygons);

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('doesPointIntersectWithPolygon', () => {
    it('should return true if the point is contained within the polygon', () => {
      // Arrange
      const point: Feature<Point, GeoJsonProperties> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [0.5, 0.5],
        },
      };

      const polygon: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      };

      // Act
      const result = doesPointExistWithinPolygon(point, polygon);

      // Assert
      expect(result).toEqual(true);
    });
  });

  it('should return false if the point is not contained within the polygon', () => {
    // Arrange
    const point: Feature<Point, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [1.5, 1.5],
      },
    };

    const polygon: Feature<Polygon, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    };

    // Act
    const result = doesPointExistWithinPolygon(point, polygon);

    // Assert
    expect(result).toEqual(false);
  });

  it('it should return the correct result if the point exists on the boundary of the polygon, depending on the options', () => {
    // Arrange
    const point: Feature<Point, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [1, 1],
      },
    };

    const polygon: Feature<Polygon, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    };

    // Act
    const ignoreBoundaryResult = doesPointExistWithinPolygon(point, polygon, {
      ignoreBoundary: true,
    });

    const includeBoundaryResult = doesPointExistWithinPolygon(point, polygon, {
      ignoreBoundary: false,
    });

    // Assert
    expect(ignoreBoundaryResult).toEqual(false);
    expect(includeBoundaryResult).toEqual(true);
  });
});
