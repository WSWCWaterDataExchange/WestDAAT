import axios from 'axios';
import { FeedbackRequest } from '../data-contracts/FeedbackRequest';

export const getBeneficialUses = async (): Promise<string[]> => {
  const url = new URL(
    'system/beneficialuses',
    process.env.REACT_APP_WEBAPI_URL
  );
  const { data } = await axios.get<string[]>(url.toString());
  return data;
};

export const getOwnerClassifications = async (): Promise<string[]> => {
  const url = new URL(
    'system/ownerclassifications',
    process.env.REACT_APP_WEBAPI_URL
  );
  const { data } = await axios.get<string[]>(url.toString());
  return data;
};

export const getWaterSourceTypes = async (): Promise<string[]> => {
  const url = new URL(
    'system/watersourcetypes',
    process.env.REACT_APP_WEBAPI_URL
  );
  const { data } = await axios.get<string[]>(url.toString());
  return data;
};

export const getStates = async (): Promise<string[]> => {
  const url = new URL('system/states', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(url.toString());
  return data;
};

export const getRiverBasinOptions = async () => {
  const { data } = await axios.get<string[]>(
    `${process.env.REACT_APP_WEBAPI_URL}system/RiverBasins`
  );
  return data;
};

export const getRiverBasinPolygonsByName = async (basinNames: string[]) => {
  const url = new URL('system/RiverBasins', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.post<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  >(url.toString(), basinNames);
  return data;
};

export const postFeedback = async (feedbackRequest: FeedbackRequest) => {
  const url = new URL('system/feedback', process.env.REACT_APP_WEBAPI_URL);
    await axios.post<FeedbackRequest>(url.toString(), feedbackRequest);
}
