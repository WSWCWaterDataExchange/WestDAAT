import {
  feature,
  SiteInfoListItem,
  waterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';

export const getWaterRightDetails = async (waterRightId: number) => {
  const { data } = await axios.get<waterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}`
  );
  return data;
};

export const getWaterRightSiteInfoList = async (waterRightId: number) => {
  const { data } = await axios.get<SiteInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/Sites`
  );
  return data;
};

export const getWaterRightSourceInfoList = async (waterRightId: number) => {
  const { data } = await axios.get<WaterSourceInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/Sources`
  );
  return data;
};

export const getRiverBasinOptions = async () => {
  const { data } = await axios.get<string[]>(
    `${process.env.REACT_APP_WEBAPI_URL}RiverBasins`
  );
  return data;
};

export const getRiverBasinPolygonsByName = async (basinNames: string[]) => {
  const url = new URL('RiverBasins', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.post<feature[]>(url.toString(), basinNames);
  return data;
};
