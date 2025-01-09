import React from 'react';
import { useParams } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useWaterRightDetails,
  useWaterRightsInfoListByAllocationUuid,
  useWaterRightSiteInfoList,
  useWaterRightSiteLocations,
  useWaterRightSourceInfoList,
} from '../../../hooks/queries';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { WaterRightDetails, SiteInfoListItem, WaterSourceInfoListItem, WaterRightsInfoListItem } from '@data-contracts';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<WaterRightDetails>;
  siteLocationsQuery: Query<FeatureCollection<Geometry, GeoJsonProperties>>;
  siteInfoListQuery: Query<SiteInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
  waterRightsInfoListQuery: Query<WaterRightsInfoListItem[]>;
}

export type ActiveTabType = 'site' | 'source' | 'rights';

interface WaterRightDetailsPageContextState {
  allocationUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: WaterRightDetailsPageContextState = {
  allocationUuid: undefined,
  activeTab: 'site',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    siteLocationsQuery: defaultQuery,
    siteInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery,
    waterRightsInfoListQuery: defaultQuery,
  },
};

const WaterRightDetailsContext = createContext<WaterRightDetailsPageContextState>(defaultState);
export const useWaterRightDetailsContext = () => useContext(WaterRightDetailsContext);

interface WaterRightDetailsProviderProps {
  children: React.ReactNode;
}
export const WaterRightDetailsProvider = ({ children }: WaterRightDetailsProviderProps) => {
  const { id: allocationUuid } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab);

  const detailsQuery = useWaterRightDetails(allocationUuid);
  const siteLocationsQuery = useWaterRightSiteLocations(allocationUuid);
  const siteInfoListQuery = useWaterRightSiteInfoList(allocationUuid, {
    enabled: activeTab === 'site',
  });
  const sourceInfoListQuery = useWaterRightSourceInfoList(allocationUuid, {
    enabled: activeTab === 'source',
  });
  const waterRightsInfoListQuery = useWaterRightsInfoListByAllocationUuid(allocationUuid, {
    enabled: activeTab === 'rights',
  });

  const filterContextProviderValue: WaterRightDetailsPageContextState = {
    allocationUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      siteLocationsQuery,
      siteInfoListQuery,
      sourceInfoListQuery,
      waterRightsInfoListQuery,
    },
  };

  return (
    <WaterRightDetailsContext.Provider value={filterContextProviderValue}>{children}</WaterRightDetailsContext.Provider>
  );
};
