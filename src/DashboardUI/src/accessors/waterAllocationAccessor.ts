import {
  SiteInfoListItem,
  WaterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';
import { AnalyticsSummaryInformation } from '../data-contracts/AnalyticsSummaryInformation';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';
import { WaterRightsSearchResults } from '../data-contracts/WaterRightsSearchResults';

export const getWaterRightDetails = async (allocationUuid: string) => {
  const { data } = await axios.get<WaterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}`
  );
  return data;
};

export const getWaterRightAnalyticsSummaryInfo = async (searchCriteria: WaterRightsSearchCriteria) => {
  const { data } = await axios.post<AnalyticsSummaryInformation[]>(`${process.env.REACT_APP_WEBAPI_URL}WaterRights/AnalyticsSummaryInformation`, searchCriteria);
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

export const downloadWaterRights = () => {
  axios.get(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/download`,
    {
      responseType: 'blob'
    }
  ).then((response)=> {

    let blob = new Blob([response.data], {type: "application/zip"});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'WaterRights.zip');
    document.body.appendChild(link);
    link.click();

    //remove elements
    link.remove();
    window.URL.revokeObjectURL(url);
  });

  function str2bytes (str: any) {
    let bytes = new Uint8Array(str.length);
    for (let i=0; i<str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
};

