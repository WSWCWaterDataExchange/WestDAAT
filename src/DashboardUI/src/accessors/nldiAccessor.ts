import * as geojson from 'geojson';
import { Directions, DataPoints } from '../data-contracts/nldi';
import westDaatApi from './westDaatApi';

export const getNldiFeatures = async (
  latitude: number,
  longitude: number,
  directions: Directions,
  dataPoints: DataPoints,
): Promise<geojson.FeatureCollection> => {
  const api = await westDaatApi();
  const { data } = await api.get<geojson.FeatureCollection>(
    `NldiFeatures/@${latitude},${longitude}?dir=${directions}&points=${dataPoints}`,
  );
  return data;
};
