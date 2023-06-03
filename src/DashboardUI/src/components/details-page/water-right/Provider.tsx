import { useParams } from 'react-router-dom';
import { createContext, FC } from "react";
import { UseQueryResult } from "react-query";
import { useWaterRightDetails, useWaterRightSiteInfoList, useWaterRightSiteLocations, useWaterRightSourceInfoList } from "../../../hooks/queries";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { WaterRightDetails } from "../../../data-contracts/WaterRightDetails";
import { SiteInfoListItem } from "../../../data-contracts/SiteInfoListItem";
import { WaterSourceInfoListItem } from "../../../data-contracts/WaterSourceInfoListItem";

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>

const defaultQuery = {data: undefined, isError: false, isLoading: false};

export interface HostData{
  detailsQuery: Query<WaterRightDetails>;
  siteLocationsQuery: Query<FeatureCollection<Geometry, GeoJsonProperties>>;
  siteInfoListQuery: Query<SiteInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
}

interface WaterRightDetailsPageContextState {
  allocationUuid: string,
  hostData: HostData
}

const defaultState: WaterRightDetailsPageContextState = {
  allocationUuid: '',
  hostData: {
    detailsQuery: defaultQuery,
    siteLocationsQuery: defaultQuery,
    siteInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery
  },
}

export const WaterRightDetailsContext = createContext<WaterRightDetailsPageContextState>(defaultState);

export const WaterRightDetailsProvider: FC = ({ children }) => {
  const { id: allocationUuid = "" } = useParams();

  const detailsQuery = useWaterRightDetails(allocationUuid);
  const siteLocationsQuery = useWaterRightSiteLocations(allocationUuid)
  const siteInfoListQuery = useWaterRightSiteInfoList(allocationUuid);
  const sourceInfoListQuery = useWaterRightSourceInfoList(allocationUuid);
  
  const filterContextProviderValue: WaterRightDetailsPageContextState  = {
    allocationUuid,
    hostData: {
      detailsQuery,
      siteLocationsQuery,
      siteInfoListQuery,
      sourceInfoListQuery
    }
  }

  return (
    <WaterRightDetailsContext.Provider value={filterContextProviderValue}>
      {children}
    </WaterRightDetailsContext.Provider>
  );
}