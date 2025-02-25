import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useOverlayDetails,
  useOverlayInfoList, useOverlayWaterRightInfoList,
} from '../../../hooks/queries';
import { OverlayDetails, OverlayTableEntry, OverlayInfoListItem } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { FeatureCollection } from 'geojson';

type Query<T> = Pick<UseQueryResult<T>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  waterRightInfoListQuery: Query<OverlayTableEntry[]>;
  overlayInfoListQuery: Query<OverlayInfoListItem[]>;
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
    waterRightInfoListQuery: defaultQuery,
    overlayInfoListQuery: defaultQuery,
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
  const waterRightInfoListQuery = useOverlayWaterRightInfoList(overlayUuid, {
    enabled: activeTab === 'right',
  });
  const overlayInfoListQuery = useOverlayInfoList(overlayUuid);
  const geometryFeature: FeatureCollection | null = detailsQuery.data?.geometry || null;

  const contextValue: OverlayDetailsPageContextState = {
    overlayUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      waterRightInfoListQuery,
      overlayInfoListQuery,
      geometryFeature,
    },
  };

  return <OverlayDetailsContext.Provider value={contextValue}>{children}</OverlayDetailsContext.Provider>;
};
