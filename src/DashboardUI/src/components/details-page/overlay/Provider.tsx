import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useOverlayDetails,
  useOverlayInfoById,
  useWaterRightsInfoListByReportingUnitUuid,
} from '../../../hooks/queries';
import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { FeatureCollection } from 'geojson';

type Query<T> = Pick<UseQueryResult<T>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  overlayInfoListQuery: Query<OverlayTableEntry[]>;
  waterRightsInfoListQuery: Query<WaterRightsInfoListItem[]>;
  geometryFeature: FeatureCollection | null;
}

type ActiveTabType = 'overlay' | 'right';

interface OverlayDetailsPageContextState {
  overlayUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: OverlayDetailsPageContextState = {
  overlayUuid: undefined,
  activeTab: 'overlay',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    overlayInfoListQuery: defaultQuery,
    waterRightsInfoListQuery: defaultQuery,
    geometryFeature: null,
  },
};

const OverlayDetailsContext = createContext<OverlayDetailsPageContextState>(defaultState);

export const useOverlayDetailsContext = () => useContext(OverlayDetailsContext);
interface OverlayDetailsProviderProps {
  children: React.ReactNode;
}

export const OverlayDetailsProvider = ({ children }: OverlayDetailsProviderProps) => {
  const { id: overlayUuid } = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab);
  const detailsQuery = useOverlayDetails(overlayUuid);
  const overlayInfoListQuery = useOverlayInfoById(overlayUuid);
  const waterRightsInfoListQuery = useWaterRightsInfoListByReportingUnitUuid(overlayUuid);
console.log(waterRightsInfoListQuery)
  const geometryFeature: FeatureCollection | null = detailsQuery.data?.geometry || null;

  const contextValue: OverlayDetailsPageContextState = {
    overlayUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      overlayInfoListQuery,
      waterRightsInfoListQuery,
      geometryFeature,
    },
  };

  return <OverlayDetailsContext.Provider value={contextValue}>{children}</OverlayDetailsContext.Provider>;
};
