import {
  SiteInfoListItem,
  waterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';

export const getWaterRightDetails = async (waterRightId: number) => {
  const { data } = await axios.get<waterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}/GetWaterRightDetails/${waterRightId}`
  );
  return data;
};

export const getWaterRightSiteInfoList = async (waterRightId: number) => {
  const { data } = await axios.get<SiteInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}/GetWaterRightSiteInfoList/${waterRightId}`
  );
  return data;
};

export const getWaterRightSourceInfoList = async (waterRightId: number) => {
  const { data } = await axios.get<WaterSourceInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}/GetWaterRightSourceInfoList/${waterRightId}`
  );
  return data;
};
