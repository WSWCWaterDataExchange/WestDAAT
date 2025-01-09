import axios from 'axios';
import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';

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
  const { data } = await axios.get<WaterRightsInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}Overlays/${reportingUnitUuid}/Legal`,
  );
  return data;
};

export const getWaterRightsInfoListByAllocationUuid = async (
  allocationUuid: string,
): Promise<WaterRightsInfoListItem[]> => {
  const { data } = await axios.get<WaterRightsInfoListItem[]>(
    `${process.env.REACT_APP_WEBAPI_URL}WaterRights/${allocationUuid}/Overlays`,
  );
  return data;
};
