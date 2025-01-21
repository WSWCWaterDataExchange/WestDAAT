import circle from '@turf/circle';
import { getCardinalDirectionCoordinatesOnFeature } from './geometryHelpers';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';

describe('getCardinalDirectionCoordinatesOnFeature', () => {
  it('should return the four coordinates of a feature that align most closely with the cardinal directions', () => {
    // generate a circle centered at the origin with a radius of 1 km
    const feature: Feature<Polygon, GeoJsonProperties> = circle([0, 0], 1, { steps: 100, units: 'kilometers' });

    let featureCoordinateMaxLat = 90,
      featureCoordinateMinLat = -90,
      featureCoordinateMaxLng = 180,
      featureCoordinateMinLng = -180;

    feature.geometry.coordinates[0].forEach((coordinate) => {
      featureCoordinateMaxLat = Math.max(featureCoordinateMaxLat, coordinate[1]);
      featureCoordinateMinLat = Math.min(featureCoordinateMinLat, coordinate[1]);
      featureCoordinateMaxLng = Math.max(featureCoordinateMaxLng, coordinate[0]);
      featureCoordinateMinLng = Math.min(featureCoordinateMinLng, coordinate[0]);
    });

    const [north, east, south, west] = getCardinalDirectionCoordinatesOnFeature(feature.geometry.coordinates[0]);

    // north and south should have latitude values that match the max and min latitudes of the feature
    expect(north[1]).toBe(featureCoordinateMinLng);
    expect(south[1]).toBe(featureCoordinateMaxLng);

    // east and west should have longitude values that match the max and min longitudes of the feature
    expect(east[0]).toBe(featureCoordinateMaxLat);
    expect(west[0]).toBe(featureCoordinateMinLat);
  });
});
