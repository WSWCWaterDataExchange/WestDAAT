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

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

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

    describe('GeoJSON file', () => {
      it('should parse a valid file', async () => {
        // Arrange
        const featureCollectionFile = new File([JSON.stringify(featureCollectionMock)], 'test.geojson', {
          type: 'application/json',
        });
        const featureFile = new File([JSON.stringify(featureCollectionMock.features[0])], 'test.geojson', {
          type: 'application/json',
        });

        // Act
        const result1 = await parseGISFileToGeoJSON(featureCollectionFile);
        const result2 = await parseGISFileToGeoJSON(featureFile);

        // Assert
        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();

        expect(result1.features.length).toBe(1);
        expect(result2.features.length).toBe(1);
      });
    });

    describe('Shapefile', () => {
      it('should parse a valid file', async () => {
        // Arrange
        // this encoded shapefile contains a single, 5-sided polygon centered around New Mexico
        const base64EncodedShapeFile =
          'AAAnCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfugDAAAFAAAAxejymooKW8BkXwLajS9AQJk+SBYk51nAxrrnBhC+QUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAABIBQAAAMXo8pqKClvAZF8C2o0vQECZPkgWJOdZwMa65wYQvkFAAQAAAAYAAAAAAAAAS6sN2VCqWsDGuucGEL5BQMXo8pqKClvAGsBGi48DQUDPHhhc++FawGRfAtqNL0BAmT5IFiTnWcAcY2NpYNBAQKEp2ZuDE1rAnlNNjO2YQUBLqw3ZUKpawMa65wYQvkFA';
        const uint8Array = base64ToUint8Array(base64EncodedShapeFile);

        const file = new File([uint8Array], 'test.shp', { type: 'application/octet-stream' });

        // Act
        const result = await parseGISFileToGeoJSON(file);

        // Assert
        expect(result).toBeTruthy();
        expect(result.features.length).toBe(1);
      });
    });

    // cannot test shapefile zip - `shpjs` uses `butUnzip` to stream the file, which works in a browser environment but not in a Node environment

    describe('unsupported file extension', () => {
      it('should throw an error', async () => {
        // Arrange
        const file = new File([''], 'test.txt', { type: 'text/plain' });

        // Act & Assert
        await expect(parseGISFileToGeoJSON(file)).rejects.toThrow(
          'Unsupported file type. Please upload a GeoJSON file or a Shapefile.',
        );
      });
    });
  });
});
