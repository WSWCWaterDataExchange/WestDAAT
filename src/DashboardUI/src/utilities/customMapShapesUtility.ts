import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import { DrawToolType } from '../data-contracts/DrawToolType';

/**
 * Creates a new `Feature` object with the given geometry.
 * The feature is initialized with the correct properties to be recognized as a circle.
 */
export const buildNewCircleFeature = (geometry: Polygon): Feature<Geometry, GeoJsonProperties> => {
  return {
    type: 'Feature',
    properties: {
      isCircle: true,
      isInProgress: true,
    },
    geometry: {
      type: 'Polygon',
      coordinates: geometry.coordinates,
    },
  };
};

/**
 * Creates a new `Feature` object without a default geometry.
 * The feature is initialized with the correct properties to be recognized as a rectangle.
 */
export const buildDefaultNewRectangleFeature = (): Feature<Geometry, GeoJsonProperties> => {
  return {
    type: 'Feature',
    properties: {
      isRectangle: true,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
  };
};

export const parseDrawToolTypeFromFeature = (feature: Feature<Geometry, GeoJsonProperties>): DrawToolType => {
  if (feature.properties?.isCircle) {
    return DrawToolType.Circle;
  }

  if (feature.properties?.isRectangle) {
    return DrawToolType.Rectangle;
  }

  return DrawToolType.Freeform;
};

export const initializeFeaturePropertyFromDrawToolType = (drawToolType: DrawToolType): GeoJsonProperties => {
  switch (drawToolType) {
    case DrawToolType.Circle:
      return {
        isCircle: true,
      };
    case DrawToolType.Rectangle:
      return {
        isRectangle: true,
      };
    default:
      return {};
  }
};
