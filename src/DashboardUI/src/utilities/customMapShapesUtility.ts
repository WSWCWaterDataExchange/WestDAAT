import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import { PolygonType } from '../data-contracts/PolygonType';

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
 * Creates a new `Feature` object with the given geometry.
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

export const parsePolygonTypeFromFeature = (feature: Feature<Geometry, GeoJsonProperties>): PolygonType => {
  if (feature.properties?.isCircle) {
    return PolygonType.Circle;
  }

  if (feature.properties?.isRectangle) {
    return PolygonType.Rectangle;
  }

  return PolygonType.Freeform;
};
