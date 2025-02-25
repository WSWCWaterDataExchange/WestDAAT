import { OverlayDetails, OverlayDigest, OverlayTableEntry, OverlayInfoListItem } from '@data-contracts';
import westDaatApi from './westDaatApi';

export const getOverlayDetails = async (overlayUuid: string): Promise<OverlayDetails> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayDetails>(`Overlays/${overlayUuid}`);
  return data;
};

export const getOverlayWaterRightInfoList = async (overlayUuid: string): Promise<OverlayTableEntry[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayTableEntry[]>(`Overlays/${overlayUuid}/Rights`);
  return data;
};

export const getOverlayInfoList = async (
  reportingUnitUuid: string,
): Promise<OverlayInfoListItem[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayInfoListItem[]>(`Overlays/${reportingUnitUuid}/Legal`);
  return data;
};

export const getOverlayDigests = async (overlayUuid: string): Promise<OverlayDigest[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayDigest[]>(`Overlays/${overlayUuid}/OverlayDigest`);
  return data;
};

