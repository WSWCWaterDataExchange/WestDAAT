import {
  SiteInfoListItem,
  WaterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';
import saveAs from 'file-saver';

export const getWaterRightDetails = async (waterRightId: number) => {
  const { data } = await axios.get<WaterRightDetails>(
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

export const getWaterRightSiteLocations = async (waterRightId: number) => {
  const { data } = await axios.get<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  >(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${waterRightId}/SiteLocations`
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

