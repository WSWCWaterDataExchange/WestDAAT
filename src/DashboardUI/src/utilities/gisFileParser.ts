import { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import shp from 'shpjs';
import * as shapefile from 'shapefile';

// logic copied/adapted from `UploadModal.tsx`

export const parseGISFileToGeoJSON = async (file: File): Promise<FeatureCollection> => {
  const fileName = file.name.toLocaleLowerCase();
  const fileExtension = fileName.split('.').pop() as string;

  let parsedData: FeatureCollection | undefined = undefined;
  switch (fileExtension) {
    case 'json':
    case 'geojson': {
      parsedData = await parseGeoJSON(file);
      break;
    }
    case 'zip': {
      parsedData = await parseShapefileZip(file);
      break;
    }
    case 'shp': {
      parsedData = await parseShapefile(file);
      break;
    }
    default: {
      throw new Error('Unsupported file type. Please upload a GeoJSON file or a Shapefile.');
    }
  }

  validateFeatureCollection(parsedData);

  return parsedData;
};

const readFile = (file: File, method: 'text' | 'arrayBuffer'): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as any);
    reader.onerror = () => reject(new Error('Failed to read file'));

    switch (method) {
      case 'text': {
        reader.readAsText(file);
        break;
      }
      case 'arrayBuffer': {
        reader.readAsArrayBuffer(file);
        break;
      }
      default: {
        throw new Error('Unsupported file read method');
      }
    }
  });
};

const validateFeatureCollection = (data: FeatureCollection): void => {
  if (
    !!data &&
    data.features.length > 0 &&
    !data.features.every((feature: Feature) => feature.geometry && feature.geometry.type === 'Polygon')
  ) {
    throw new Error(
      'File is missing data or includes unsupported geometry types. Please upload a file with only Polygon or MultiPolygon geometries.',
    );
  }
};

const parseGeoJSON = async (file: File): Promise<FeatureCollection> => {
  const fileContent = (await readFile(file, 'text')) as string;

  const initialParsedData = JSON.parse(fileContent);

  const keys = Object.keys(initialParsedData);
  if (!keys.includes('type')) {
    throw new Error('Invalid GeoJSON file. Please upload a valid GeoJSON file.');
  }

  const geoJsonParsedData = initialParsedData as GeoJsonObject;
  switch (geoJsonParsedData.type) {
    case 'FeatureCollection': {
      return geoJsonParsedData as FeatureCollection;
    }
    case 'Feature': {
      return {
        type: 'FeatureCollection',
        features: [geoJsonParsedData],
      } as FeatureCollection;
    }
    default: {
      throw new Error(`Unsupported GeoJSON type "${geoJsonParsedData.type}". Please upload a valid GeoJSON file.`);
    }
  }
};

const parseShapefileZip = async (file: File): Promise<FeatureCollection> => {
  const fileContent = (await readFile(file, 'arrayBuffer')) as ArrayBuffer;
  const geojsonData = await shp(fileContent);

  let featureCollection: FeatureCollection;

  if (Array.isArray(geojsonData)) {
    featureCollection = {
      type: 'FeatureCollection',
      features: geojsonData.flatMap((fc) => fc.features),
    };
  } else {
    featureCollection = geojsonData;
  }

  return featureCollection;
};

const parseShapefile = async (file: File): Promise<FeatureCollection> => {
  const fileContent = (await readFile(file, 'arrayBuffer')) as ArrayBuffer;
  const source = await shapefile.open(fileContent);

  const features: Feature[] = [];

  let result = await source.read();
  while (!result.done) {
    features.push(result.value);
    result = await source.read();
  }

  return {
    type: 'FeatureCollection',
    features: features,
  };
};
