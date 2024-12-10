import React from 'react';
import { useParams } from 'react-router-dom';
import { createContext, FC, useContext, useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useSiteDetails,
  useSiteUsage,
  useWaterRightInfoList,
  useWaterSiteLocation,
  useWaterSiteSourceInfoList,
} from '../../../hooks/queries';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import {
  WaterSourceInfoListItem,
  SiteDetails,
  WaterRightInfoListItem,
} from '@data-contracts';
import {SiteUsage} from "../../../data-contracts/SiteUsage";

type Query<T> = Pick<
  UseQueryResult<T, unknown>,
  'data' | 'isError' | 'isLoading'
>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<SiteDetails>;
  locationsQuery: Query<Feature<Geometry, GeoJsonProperties>>;
  waterRightInfoListQuery: Query<WaterRightInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
  siteUsageQuery: Query<SiteUsage>;
}

type ActiveTabType = 'source' | 'right';

interface SiteDetailsPageContextState {
  siteUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: SiteDetailsPageContextState = {
  siteUuid: undefined,
  activeTab: 'source',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    locationsQuery: defaultQuery,
    waterRightInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery,
    siteUsageQuery: defaultQuery,
  },
};

const SiteDetailsContext =
  createContext<SiteDetailsPageContextState>(defaultState);
export const useSiteDetailsContext = () => useContext(SiteDetailsContext);

export const SiteDetailsProvider: FC = ({ children }) => {
  const { id: siteUuid } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTabType>(
    defaultState.activeTab,
  );

  const detailsQuery = useSiteDetails(siteUuid);
  const locationsQuery = useWaterSiteLocation(siteUuid);
  const waterRightInfoListQuery = useWaterRightInfoList(siteUuid, {
    enabled: activeTab === 'right',
  });
  const sourceInfoListQuery = useWaterSiteSourceInfoList(siteUuid, {
    enabled: activeTab === 'source',
  });
  const siteUsageQuery = useSiteUsage(siteUuid);

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
    },
  };

  return (
    <SiteDetailsContext.Provider value={filterContextProviderValue}>
      {children}
    </SiteDetailsContext.Provider>
  );
};
