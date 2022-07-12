import {
  SiteInfoListItem,
  WaterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import { WaterRightsSearchResults } from '../data-contracts/WaterRightsSearchResults';
import saveAs from 'file-saver';

export const getWaterRightDetails = async (allocationUuid: string) => {
  const { data } = await axios.get<WaterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}`
  );
  return data;
};

export const findWaterRight = async (searchCriteria: WaterRightsSearchCriteria) => {
  const { data } = await axios.post<WaterRightsSearchResults>(`${process.env.REACT_APP_WEBAPI_URL}WaterRights/find`, searchCriteria);
  return data;
};

export const getWaterRightSiteInfoList = async (allocationUuid: string) => {
  const { data } = await axios.get<SiteInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}/Sites`
  );
  return data;
};

export const getWaterRightSourceInfoList = async (allocationUuid: string) => {
  const { data } = await axios.get<WaterSourceInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}/Sources`
  );
  return data;
};

export const getWaterRightSiteLocations = async (allocationUuid: string) => {
  const { data } = await axios.get<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  >(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}/SiteLocations`
  );
  return data;
};

export const downloadWaterRights = async () => {
  await axios.post<any>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/download`,
    {responseType: 'arraybuffer'}
  ).then((response)=>{
    console.log(response.data);
    saveAs(new Blob([response.data], {type: 'application/zip'}), "WaterRights.zip")
  });
};

