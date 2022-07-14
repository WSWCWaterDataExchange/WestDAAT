import {
  SiteInfoListItem,
  WaterRightDetails,
  WaterSourceInfoListItem,
} from '@data-contracts';
import axios from 'axios';
import { saveAs } from 'file-saver';
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

export const downloadWaterRights = (searchCriteria: WaterRightsSearchCriteria) => {


  // using fetch instead of axios as axios seems not to be able to handle zip downloads on POST requests
  //https://stackoverflow.com/questions/70969837/how-to-download-zip-file-that-i-recieve-from-a-http-response-axios-put-request#:~:text=0,fetch%20over%20axios
  fetch(`${process.env.REACT_APP_WEBAPI_URL}WaterRights/download`,
        {
          method: "POST",
          body: JSON.stringify(searchCriteria)
      },)
    .then(response=> response.blob())
    .then(blob => saveAs(blob, 'WaterRigths.zip'))
};
