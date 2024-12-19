import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayDetails } from '../../../hooks/queries';
import { OverlayDetails } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  geometryFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> | null;
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
    geometryFeatureCollection: null,
  },
};

const OverlayDetailsContext = createContext<OverlayDetailsPageContextState>(defaultState);

export const useOverlayDetailsContext = () => useContext(OverlayDetailsContext);

export const OverlayDetailsProvider: React.FC = ({ children }) => {
  const { id: overlayUuid } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab);

  const detailsQuery = useOverlayDetails(overlayUuid);

  const rawGeometry = detailsQuery.data?.geometry ? JSON.parse(detailsQuery.data.geometry) : null;

  const geometryFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> | null = rawGeometry
      ? (rawGeometry.type === 'FeatureCollection'
              ? rawGeometry
              : {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: rawGeometry,
                    properties: {},
                  },
                ],
              }
      )
      : null;

  const contextValue: OverlayDetailsPageContextState = {
    overlayUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery,
      geometryFeatureCollection,
    },
  };

  return (
    <OverlayDetailsContext.Provider value={contextValue}>
      {children}
    </OverlayDetailsContext.Provider>
  );
};
