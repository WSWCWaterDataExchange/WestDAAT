import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import {
  buildDefaultNewRectangleFeature,
  buildNewCircleFeature,
  parsePolygonTypeFromFeature,
} from './customMapShapesUtility';
import { PolygonType } from '../data-contracts/PolygonType';

describe('customMapShapesUtility', () => {
  describe('buildNewCircleFeature', () => {
    const circleGeometry: Polygon = {
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
    };

    it('should return a new circle feature with correct properties', () => {
      const feature = buildNewCircleFeature(circleGeometry);

      expect(feature.type).toBe('Feature');
      expect(feature.geometry).toEqual(circleGeometry);
      expect(feature.properties?.isCircle).toBe(true);
      expect(feature.properties?.isInProgress).toBe(true);
    });
  });

  describe('buildDefaultNewRectangleFeature', () => {
    const rectangleGeometry: Polygon = {
      type: 'Polygon',
      coordinates: [[]],
    };
    it('should return a new rectangle feature with correct properties', () => {
      const feature = buildDefaultNewRectangleFeature();

      expect(feature.type).toBe('Feature');
      expect(feature.geometry).toEqual(rectangleGeometry);
      expect(feature.properties?.isRectangle).toBe(true);
    });
  });

  describe('parsePolygonTypeFromFeature', () => {
    it('should recognize a circle', () => {
      const circleFeature = buildNewCircleFeature({
        type: 'Polygon',
        coordinates: [[]],
      });

      const result = parsePolygonTypeFromFeature(circleFeature);

      expect(result).toBe(PolygonType.Circle);
    });

    it('should recognize a rectangle', () => {
      const rectangleFeature = buildDefaultNewRectangleFeature();

      const result = parsePolygonTypeFromFeature(rectangleFeature);

      expect(result).toBe(PolygonType.Rectangle);
    });

    it('should default to freeform', () => {
      const feature: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[]],
        },
        properties: {},
      };

      const result = parsePolygonTypeFromFeature(feature);

      expect(result).toBe(PolygonType.Freeform);
    });
  });
});
