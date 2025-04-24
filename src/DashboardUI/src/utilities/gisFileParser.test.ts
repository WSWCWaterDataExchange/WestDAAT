import './mapboxTestSetup.mock';

import { Feature, FeatureCollection, GeoJsonProperties, Polygon } from 'geojson';
import { polygonMock } from '../mocks/GeoJsonGeometries.mock';
import { parseGISFileToGeoJSON } from './gisFileParser';

const featureCollectionMock: FeatureCollection<Polygon, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [polygonMock].map(
    (geometry): Feature<Polygon, GeoJsonProperties> => ({
      type: 'Feature',
      geometry,
      properties: {},
    }),
  ),
};

// todo: write tests for each supported file extension
describe('GIS File Parser', () => {
  describe('parseGISFileToGeoJSON', () => {
    describe('JSON file', () => {
      it('should parse a valid file', async () => {
        // Arrange
        const file = new File([JSON.stringify(featureCollectionMock)], 'test.json', { type: 'application/json' });

        // Act
        const result = await parseGISFileToGeoJSON(file);

        // Assert
        expect(result).toBeTruthy();

        const featureCount = featureCollectionMock.features.length;
        expect(result.features.length).toBe(featureCount);
      });
    });
  });
});
