import axios from 'axios';
import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';
import { OverlayDetailsSearchCriteria } from '../data-contracts/OverlayDetailsSearchCriteria';

export const getOverlayDetails = async (overlayUuid: string): Promise<OverlayDetails> => {
  const { data } = await axios.get<OverlayDetails>(`${process.env.REACT_APP_WEBAPI_URL}Overlays/${overlayUuid}`);
  return data;
};

export const getOverlayInfoById = async (overlayUuid: string): Promise<OverlayTableEntry[]> => {
  const { data } = await axios.get<OverlayTableEntry[]>(
    `${process.env.REACT_APP_WEBAPI_URL}Overlays/${overlayUuid}/Rights`,
  );
  return data;
};

export const getWaterRightsInfoListByReportingUnitUuid = async (
  reportingUnitUuid: string,
): Promise<WaterRightsInfoListItem[]> => {
  const request: OverlayDetailsSearchCriteria = {
    reportingUnitUUID: reportingUnitUuid,
    allocationUUID: null,
  };

  const { data } = await axios.post<WaterRightsInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}Overlays/Legal`,
    request,
  );
  return data;
};

export const getWaterRightsInfoListByAllocationUuid = async (
  allocationUuid: string,
): Promise<WaterRightsInfoListItem[]> => {
  const request: OverlayDetailsSearchCriteria = {
    reportingUnitUUID: null,
    allocationUUID: allocationUuid,
  };

  const { data } = await axios.post<WaterRightsInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}Overlays/Legal`,
    request,
  );
  return data;
};
