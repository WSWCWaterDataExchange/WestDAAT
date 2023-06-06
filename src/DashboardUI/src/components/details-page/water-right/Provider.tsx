import { useParams } from 'react-router-dom';
import { createContext, FC, useContext, useState } from "react";
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

type ActiveTabType = 'site' | 'source';
interface WaterRightDetailsPageContextState {
  allocationUuid: string | undefined,
  activeTab: ActiveTabType,
  setActiveTab: (tab: ActiveTabType) => void,
  hostData: HostData
}

const defaultState: WaterRightDetailsPageContextState = {
  allocationUuid: undefined,
  activeTab: 'site',
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    siteLocationsQuery: defaultQuery,
    siteInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery
  },
}

const WaterRightDetailsContext = createContext<WaterRightDetailsPageContextState>(defaultState);
export const useWaterRightDetailsContext = () => useContext(WaterRightDetailsContext)

export const WaterRightDetailsProvider: FC = ({ children }) => {
  const { id: allocationUuid } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTabType>(defaultState.activeTab)

  const detailsQuery = useWaterRightDetails(allocationUuid);
  const siteLocationsQuery = useWaterRightSiteLocations(allocationUuid)
  const siteInfoListQuery = useWaterRightSiteInfoList(allocationUuid, {enabled: activeTab === 'site'});
  const sourceInfoListQuery = useWaterRightSourceInfoList(allocationUuid, {enabled: activeTab === 'source'});
  
  const filterContextProviderValue: WaterRightDetailsPageContextState  = {
    allocationUuid,
    activeTab,
    setActiveTab,
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