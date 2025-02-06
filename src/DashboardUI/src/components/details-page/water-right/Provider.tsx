import React from 'react';
import { useParams } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useTimeSeriesRightsInfoList,
  useWaterRightDetails,
  useWaterRightsInfoListByAllocationUuid,
  useWaterRightSiteInfoList,
  useWaterRightSiteLocations,
  useWaterRightSourceInfoList,
} from '../../../hooks/queries';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { WaterRightDetails, SiteInfoListItem, WaterSourceInfoListItem, WaterRightsInfoListItem } from '@data-contracts';
import { TimeSeriesListItem } from '../../../data-contracts/TimeSeriesListItem';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<WaterRightDetails>;
  siteLocationsQuery: Query<FeatureCollection<Geometry, GeoJsonProperties>>;
  siteInfoListQuery: Query<SiteInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
  waterRightsInfoListQuery: Query<WaterRightsInfoListItem[]>;
  timeSeriesInfoListQuery: Query<TimeSeriesListItem[]>;
}

export type ActiveTabType = 'site' | 'source' | 'rights' | 'timeSeries';

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
    timeSeriesInfoListQuery: defaultQuery,
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
  const timeSeriesInfoListQuery = useTimeSeriesRightsInfoList(allocationUuid, {
    enabled: activeTab === 'timeSeries',
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
      timeSeriesInfoListQuery,
    },
  };

  return (
    <WaterRightDetailsContext.Provider value={filterContextProviderValue}>{children}</WaterRightDetailsContext.Provider>
  );
};
