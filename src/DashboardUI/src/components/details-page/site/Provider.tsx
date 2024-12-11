import React, { createContext, FC, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UseQueryResult } from 'react-query';
import {
  useSiteDetails,
  useSiteUsage,
  useSiteVariableInfoList,
  useWaterRightInfoList,
  useWaterSiteLocation,
  useWaterSiteSourceInfoList,
} from '../../../hooks/queries';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { SiteDetails, WaterRightInfoListItem, WaterSourceInfoListItem } from '@data-contracts';
import { SiteUsage } from '../../../data-contracts/SiteUsage';
import { VariableInfoListItem } from '../../../data-contracts/VariableInfoListItem';
import { SiteActiveTabType } from './enums/SiteActiveTabType';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<SiteDetails>;
  locationsQuery: Query<Feature<Geometry, GeoJsonProperties>>;
  waterRightInfoListQuery: Query<WaterRightInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
  siteUsageQuery: Query<SiteUsage>;
  variableInfoListQuery: Query<VariableInfoListItem[]>;
}

interface SiteDetailsPageContextState {
  siteUuid: string | undefined;
  activeTab: SiteActiveTabType;
  setActiveTab: (tab: SiteActiveTabType) => void;
  hostData: HostData;
}

const defaultState: SiteDetailsPageContextState = {
  siteUuid: undefined,
  activeTab: SiteActiveTabType.source,
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    locationsQuery: defaultQuery,
    waterRightInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery,
    siteUsageQuery: defaultQuery,
    variableInfoListQuery: defaultQuery,
  },
};

const SiteDetailsContext = createContext<SiteDetailsPageContextState>(defaultState);
export const useSiteDetailsContext = () => useContext(SiteDetailsContext);

export const SiteDetailsProvider: FC = ({ children }) => {
  const { id: siteUuid } = useParams();

  const [activeTab, setActiveTab] = useState<SiteActiveTabType>(defaultState.activeTab);

  const detailsQuery = useSiteDetails(siteUuid);
  const locationsQuery = useWaterSiteLocation(siteUuid);
  const siteUsageQuery = useSiteUsage(siteUuid);
  const waterRightInfoListQuery = useWaterRightInfoList(siteUuid, {
    enabled: activeTab === SiteActiveTabType.right,
  });
  const sourceInfoListQuery = useWaterSiteSourceInfoList(siteUuid, {
    enabled: activeTab === SiteActiveTabType.source,
  });
  const variableInfoListQuery = useSiteVariableInfoList(siteUuid, {
    enabled: activeTab === SiteActiveTabType.variable,
  });

  const filterContextProviderValue: SiteDetailsPageContextState = {
    siteUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      locationsQuery,
      waterRightInfoListQuery,
      sourceInfoListQuery,
      siteUsageQuery,
      variableInfoListQuery,
    },
  };

  return <SiteDetailsContext.Provider value={filterContextProviderValue}>{children}</SiteDetailsContext.Provider>;
};
