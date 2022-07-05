import {
  SiteInfoListItem,
  WaterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import { WaterRightsSearchResults } from '../data-contracts/WaterRightsSearchResults';

export const getWaterRightDetails = async (waterRightId: string) => {
  const { data } = await axios.get<WaterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}`
  );
  return data;
};

export const findWaterRight = async (searchCriteria: WaterRightsSearchCriteria) => {
  const { data } = await axios.post<WaterRightsSearchResults>(`${process.env.REACT_APP_WEBAPI_URL}WaterRights/find`, searchCriteria);
  return data;
};

export const getWaterRightSiteInfoList = async (waterRightId: string) => {
  const { data } = await axios.get<SiteInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/Sites`
  );
  return data;
};

export const getWaterRightSourceInfoList = async (waterRightId: string) => {
  const { data } = await axios.get<WaterSourceInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/Sources`
  );
  return data;
};

export const getWaterRightSiteLocations = async (waterRightId: string) => {
  const { data } = await axios.get<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  >(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/SiteLocations`
  );
  return data;
};
