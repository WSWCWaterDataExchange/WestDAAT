import './geometryHelpers.mock';

import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { doPolygonsIntersect } from './geometryHelpers';

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
