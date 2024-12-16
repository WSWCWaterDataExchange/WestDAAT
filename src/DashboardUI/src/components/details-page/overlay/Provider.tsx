import React, { createContext, useContext, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Uncomment for dynamic ID
import { useOverlayDetails } from '../../../hooks/queries';
import { OverlayDetails } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import wellknown from 'wellknown';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  geometryFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> | null;
}

type ActiveTabType = 'details';

interface OverlayDetailsPageContextState {
  overlayUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: OverlayDetailsPageContextState = {
  overlayUuid: undefined,
  activeTab: 'details',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    geometryFeatureCollection: null,
  },
};

const OverlayDetailsContext = createContext<OverlayDetailsPageContextState>(defaultState);

export const useOverlayDetailsContext = () => useContext(OverlayDetailsContext);

export const OverlayDetailsProvider: React.FC = ({ children }) => {
  // const { id: overlayUuid } = useParams(); // Uncomment for dynamic ID
  const overlayUuid = 'UTre_RUut_99'; // Hardcoded for testing

  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab);

  const detailsQuery = useOverlayDetails(overlayUuid);

  const geometryFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> | null = detailsQuery.data?.geometry
    ? {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: wellknown.parse(detailsQuery.data.geometry as unknown as string) as Geometry, //fix this, uninstall wellknown and wellknown/types
          // this casting above is a temp fix until fixing the backend
          properties: {},
        },
      ],
    }
    : null;

  console.log("Geometry Feature Collection: ", geometryFeatureCollection);

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
