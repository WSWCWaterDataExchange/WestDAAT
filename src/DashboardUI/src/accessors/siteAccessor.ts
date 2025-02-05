import { WaterSourceInfoListItem, SiteDetails, WaterRightInfoListItem, OverlayDigest } from '@data-contracts';
import WaterRightDigest from '../data-contracts/WaterRightsDigest';
import SiteDigest from '../data-contracts/SiteDigest';
import { SiteUsage } from '../data-contracts/SiteUsage';
import { VariableInfoListItem } from '../data-contracts/VariableInfoListItem';
import { MethodInfoListItem } from '../data-contracts/MethodInfoListItem';
import westDaatApi from './westDaatApi';
import { TimeSeriesListItem } from '../data-contracts/TimeSeriesListItem';

export const getWaterRightsDigests = async (siteUuid: string): Promise<WaterRightDigest[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterRightDigest[]>(`Sites/${siteUuid}/WaterRightsDigest`);
  return data;
};

export const getSiteDigest = async (siteUuid: string): Promise<SiteDigest> => {
  const api = await westDaatApi();
  const { data } = await api.get<SiteDigest>(`Sites/${siteUuid}/Digest`);
  return data;
};

export const getOverlayDigests = async (overlayUuid: string): Promise<OverlayDigest[]> => {
  const api = await westDaatApi();
  const { data } = await api.get<OverlayDigest[]>(`Overlays/${overlayUuid}/OverlayDigest`);
  return data;
};

export const getWaterSiteLocation = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>(
    `Sites/${siteUuid}/SiteLocation`,
  );
  return data;
};

export const getWaterSiteSourceInfoList = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterSourceInfoListItem[]>(`Sites/${siteUuid}/Sources`);
  return data;
};

export const getWaterRightInfoList = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<WaterRightInfoListItem[]>(`Sites/${siteUuid}/Rights`);
  return data;
};

export const getTimeSeriesSiteInfoList = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<TimeSeriesListItem[]>(`Sites/${siteUuid}/UsageTable`);
  return data;
};

export const getTimeSeriesRightInfoList = async (allocationUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<TimeSeriesListItem[]>(`WaterRights/${allocationUuid}/UsageTable`);
  return data;
};

export const getSiteDetails = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<SiteDetails>(`Sites/${siteUuid}`);
  return data;
};

export const getSiteUsage = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<SiteUsage>(`Sites/${siteUuid}/SiteUsage`);

  data.siteUsagePoints = data.siteUsagePoints.map((d) => ({
    variableUuid: d.variableUuid,
    timeFrameStartDate: new Date(d.timeFrameStartDate),
    amount: d.amount,
  }));

  return data;
};

export const getSiteVariableInfoList = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<VariableInfoListItem[]>(`Sites/${siteUuid}/Variables`);
  return data;
};

export const getSiteMethodInfoList = async (siteUuid: string) => {
  const api = await westDaatApi();
  const { data } = await api.get<MethodInfoListItem[]>(`Sites/${siteUuid}/Methods`);
  return data;
};
