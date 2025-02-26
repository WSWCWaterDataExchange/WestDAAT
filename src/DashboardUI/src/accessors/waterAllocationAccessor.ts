import { SiteInfoListItem, WaterRightDetails, OverlayInfoListItem, WaterSourceInfoListItem } from '@data-contracts';
import { saveAs } from 'file-saver';
import {
  WaterRightsSearchCriteria,
  WaterRightsSearchCriteriaWithFilterUrl,
  WaterRightsSearchCriteriaWithPaging,
} from '../data-contracts/WaterRightsSearchCriteria';
import { WaterRightsSearchResults } from '../data-contracts/WaterRightsSearchResults';
import { FeatureCollection } from 'geojson';
import { AnalyticsSummaryInformationResponse } from '../data-contracts/AnalyticsSummaryInformationResponse';
import westDaatApi from './westDaatApi';

export const getWaterRightDetails = async (allocationUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterRightDetails>(`WaterRights/${allocationUuid}`);
  return data;
};

export const getWaterRightAnalyticsSummaryInfo = async (searchCriteria: WaterRightsSearchCriteria) => {
  const api = await westDaatApi();
  const { data } = await api.post<AnalyticsSummaryInformationResponse>(
    `WaterRights/AnalyticsSummaryInformation`,
    searchCriteria,
  );
  return data;
};

export const getWaterRightDataEnvelope = async (searchCriteria: WaterRightsSearchCriteria) => {
  const api = await westDaatApi();
  const { data } = await api.post<FeatureCollection>(`WaterRights/DataEnvelope`, searchCriteria);
  return data;
};

export const findWaterRight = async (searchCriteria: WaterRightsSearchCriteriaWithPaging) => {
  const api = await westDaatApi();
  const { data } = await api.post<WaterRightsSearchResults>(`WaterRights/find`, searchCriteria);
  return data;
};

export const getWaterRightSiteInfoList = async (allocationUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<SiteInfoListItem[]>(`WaterRights/${allocationUuid}/Sites`);
  return data;
};

export const getWaterRightSourceInfoList = async (allocationUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterSourceInfoListItem[]>(`WaterRights/${allocationUuid}/Sources`);
  return data;
};

export const getWaterRightSiteLocations = async (allocationUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<FeatureCollection>(`WaterRights/${allocationUuid}/SiteLocations`);
  return data;
};

export const getWaterRightOverlayInfoList = async (
  allocationUuid: string,
): Promise<OverlayInfoListItem[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayInfoListItem[]>(`WaterRights/${allocationUuid}/Overlays`);
  return data;
};


export const downloadWaterRights = async (searchCriteria: WaterRightsSearchCriteriaWithFilterUrl) => {
  // using fetch instead of axios as axios seems not to be able to handle zip downloads on POST requests
  //https://stackoverflow.com/questions/70969837/how-to-download-zip-file-that-i-recieve-from-a-http-response-axios-put-request#:~:text=0,fetch%20over%20axios

  const response = await fetch(`${process.env.REACT_APP_WEBAPI_URL}WaterRights/download`, {
    method: 'POST',
    body: JSON.stringify(searchCriteria),
  });

  if (response.ok) {
    const blob = await response.blob();
    if (blob && blob.size > 0) {
      saveAs(blob, 'WaterRights.zip');
    } else {
      throw Error('Something went wrong, please try again later');
    }
  } else {
    const errorMessage = response.status === 413 ? 'Download limit exceeded.' : 'Something went wrong';
    throw Error(errorMessage);
  }
};
