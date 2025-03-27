import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import { PolygonType } from '../data-contracts/PolygonType';

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
