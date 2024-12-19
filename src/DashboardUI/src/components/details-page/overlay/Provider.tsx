import React, { createContext, FC, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useOverlayDetails,
  useOverlayInfoById,
  useWaterRightsInfoListByReportingUnitUuid,
} from '../../../hooks/queries';
import { OverlayDetails, OverlayTableEntry, WaterRightsInfoListItem } from '@data-contracts';
import { UseQueryResult } from 'react-query';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import wellknown from 'wellknown'; // Temporary fix until backend is updated

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<OverlayDetails>;
  overlayInfoListQuery: Query<OverlayTableEntry[]>;
  waterRightsInfoListQuery: Query<WaterRightsInfoListItem[]>;
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
    overlayInfoListQuery: defaultQuery,
    waterRightsInfoListQuery: defaultQuery,
    geometryFeatureCollection: null,
  },
};

const OverlayDetailsContext = createContext<OverlayDetailsPageContextState>(defaultState);

export const useOverlayDetailsContext = () => useContext(OverlayDetailsContext);

export const OverlayDetailsProvider: FC = ({ children }) => {
  const { id: overlayUuid } = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('admin');

  const detailsQuery = useOverlayDetails(overlayUuid);
  const overlayInfoListQuery = useOverlayInfoById(overlayUuid, {
    enabled: activeTab === 'water-right',
  });
  const waterRightsInfoListQuery = useWaterRightsInfoListByReportingUnitUuid(overlayUuid, {
    enabled: activeTab === 'admin',
  });

  const geometryFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> | null = detailsQuery.data?.geometry
    ? {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: wellknown.parse(detailsQuery.data.geometry as unknown as string) as Geometry,
            properties: {},
          },
        ],
      }
    : null;

  const hostData: HostData = {
    detailsQuery,
    overlayInfoListQuery,
    waterRightsInfoListQuery,
    geometryFeatureCollection,
  };

  const contextValue: OverlayDetailsPageContextState = {
    overlayUuid,
    activeTab,
    setActiveTab,
    hostData,
  };

  return <OverlayDetailsContext.Provider value={contextValue}>{children}</OverlayDetailsContext.Provider>;
};
