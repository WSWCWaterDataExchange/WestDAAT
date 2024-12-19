import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayDetails } from '../../../hooks/queries';
import { OverlayDetails } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  geometryFeature: Feature<Geometry, GeoJsonProperties> | null;
}

type ActiveTabType = 'admin' | 'water-right';

interface OverlayDetailsPageContextState {
  overlayUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: OverlayDetailsPageContextState = {
  overlayUuid: undefined,
  activeTab: 'admin',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    geometryFeature: null,
  },
};

const OverlayDetailsContext = createContext<OverlayDetailsPageContextState>(defaultState);

export const useOverlayDetailsContext = () => useContext(OverlayDetailsContext);

export const OverlayDetailsProvider: React.FC = ({ children }) => {
  const { id: overlayUuid } = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab);
  const detailsQuery = useOverlayDetails(overlayUuid);

  const geometryFeature: Feature<Geometry, GeoJsonProperties> | null = detailsQuery.data?.geometry || null;

  const contextValue: OverlayDetailsPageContextState = {
    overlayUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      geometryFeature,
    },
  };

  return <OverlayDetailsContext.Provider value={contextValue}>{children}</OverlayDetailsContext.Provider>;
};
