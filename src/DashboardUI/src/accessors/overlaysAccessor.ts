import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';
import westDaatApi from './westDaatApi';

export const getOverlayDetails = async (overlayUuid: string): Promise<OverlayDetails> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayDetails>(`Overlays/${overlayUuid}`);
  return data;
};

export const getOverlayInfoById = async (overlayUuid: string): Promise<OverlayTableEntry[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayTableEntry[]>(`Overlays/${overlayUuid}/Rights`);
  return data;
};

export const getWaterRightsInfoListByReportingUnitUuid = async (
  reportingUnitUuid: string,
): Promise<WaterRightsInfoListItem[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterRightsInfoListItem[]>(`Overlays/${reportingUnitUuid}/Legal`);
  return data;
};

export const getWaterRightsInfoListByAllocationUuid = async (
  allocationUuid: string,
): Promise<WaterRightsInfoListItem[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterRightsInfoListItem[]>(`WaterRights/${allocationUuid}/Overlays`);
  return data;
};
