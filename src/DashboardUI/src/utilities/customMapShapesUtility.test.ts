import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import {
  buildDefaultNewRectangleFeature,
  buildNewCircleFeature,
  parseDrawToolTypeFromFeature,
} from './customMapShapesUtility';
import { DrawToolType } from '../data-contracts/DrawToolType';

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

  describe('parseDrawToolTypeFromFeature', () => {
    it('should recognize a circle', () => {
      const circleFeature = buildNewCircleFeature({
        type: 'Polygon',
        coordinates: [[]],
      });

      const result = parseDrawToolTypeFromFeature(circleFeature);

      expect(result).toBe(DrawToolType.Circle);
    });

    it('should recognize a rectangle', () => {
      const rectangleFeature = buildDefaultNewRectangleFeature();

      const result = parseDrawToolTypeFromFeature(rectangleFeature);

      expect(result).toBe(DrawToolType.Rectangle);
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

      const result = parseDrawToolTypeFromFeature(feature);

      expect(result).toBe(DrawToolType.Freeform);
    });
  });
});
