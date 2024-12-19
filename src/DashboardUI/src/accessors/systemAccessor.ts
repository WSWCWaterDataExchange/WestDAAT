import axios from 'axios';
import { FeedbackRequest } from '../data-contracts/FeedbackRequest';
import { DashboardFilters } from '../data-contracts/DashboardFilters';

export const getFilters = async (): Promise<DashboardFilters> => {
  const url = new URL('system/filters', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<DashboardFilters>(url.toString());
  return data;
};

export const getRiverBasinOptions = async () => {
  const { data } = await axios.get<string[]>(`${process.env.REACT_APP_WEBAPI_URL}system/RiverBasins`);
  return data;
};

export const getRiverBasinPolygonsByName = async (basinNames: string[]) => {
  const url = new URL('system/RiverBasins', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.post<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>(
    url.toString(),
    basinNames,
  );
  return data;
};

export const postFeedback = async (feedbackRequest: FeedbackRequest) => {
  const url = new URL('system/feedback', process.env.REACT_APP_WEBAPI_URL);
  return axios.post<FeedbackRequest>(url.toString(), feedbackRequest).catch(() => {
    return false;
  });
};
