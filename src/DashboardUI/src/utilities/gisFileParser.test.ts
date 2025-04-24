import './gisFileParser.mock';

import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { geometryCollectionMock } from '../mocks/GeoJsonGeometries.mock';
import { parseGISFileToGeoJSON } from './gisFileParser';

const featureCollectionMock: FeatureCollection = {
  type: 'FeatureCollection',
  features: geometryCollectionMock.geometries.map(
    (geometry): Feature<Geometry, GeoJsonProperties> => ({
      type: 'Feature',
      geometry,
      properties: {},
    }),
  ),
};

// todo: write tests for each supported file extension
// currently the test fails to run and I don't understand the error :/
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
