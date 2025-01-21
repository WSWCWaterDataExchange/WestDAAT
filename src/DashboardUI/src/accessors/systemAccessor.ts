import { FeedbackRequest } from '../data-contracts/FeedbackRequest';
import { DashboardFilters } from '../data-contracts/DashboardFilters';
import westDaatApi from './westDaatApi';

export const getFilters = async (): Promise<DashboardFilters> => {
  const api = await westDaatApi();
  const { data } = await api.get('system/filters');
  return data;
};

export const getRiverBasinOptions = async () => {
  const api = await westDaatApi();
  const { data } = await api.get<string[]>('system/RiverBasins');
  return data;
};

export const getRiverBasinPolygonsByName = async (basinNames: string[]) => {
  const api = await westDaatApi();
  const { data } = await api.post<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>(
    'system/RiverBasins',
    basinNames,
  );
  return data;
};

export const postFeedback = async (feedbackRequest: FeedbackRequest) => {
  const api = await westDaatApi();
  return api.post<FeedbackRequest>('system/feedback', feedbackRequest).catch(() => {
    return false;
  });
};
