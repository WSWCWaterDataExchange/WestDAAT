import { useParams } from 'react-router-dom';
import { createContext, FC, useContext } from "react";
import { UseQueryResult } from "react-query";
import { useSiteDetails, useWaterRightInfoList, useWaterSiteLocation, useWaterSiteSourceInfoList } from "../../../hooks/queries";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { WaterSourceInfoListItem } from "../../../data-contracts/WaterSourceInfoListItem";
import { SiteDetails } from '../../../data-contracts/SiteDetails';
import { WaterRightInfoListItem } from '../../../data-contracts/WaterRightInfoListItem';

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>

const defaultQuery = {data: undefined, isError: false, isLoading: false};

export interface HostData{
  detailsQuery: Query<SiteDetails>;
  locationsQuery: Query<Feature<Geometry, GeoJsonProperties>>;
  waterRightInfoListQuery: Query<WaterRightInfoListItem[]>;
  sourceInfoListQuery: Query<WaterSourceInfoListItem[]>;
}

interface SiteDetailsPageContextState {
  siteUuid: string | undefined,
  hostData: HostData
}

const defaultState: SiteDetailsPageContextState = {
  siteUuid: undefined,
  hostData: {
    detailsQuery: defaultQuery,
    locationsQuery: defaultQuery,
    waterRightInfoListQuery: defaultQuery,
    sourceInfoListQuery: defaultQuery
  },
}

const SiteDetailsContext = createContext<SiteDetailsPageContextState>(defaultState);
export const useSiteDetailsContext = () => useContext(SiteDetailsContext)

export const SiteDetailsProvider: FC = ({ children }) => {
  const { id: siteUuid } = useParams();

  const detailsQuery = useSiteDetails(siteUuid);
  const locationsQuery = useWaterSiteLocation(siteUuid);
  const waterRightInfoListQuery = useWaterRightInfoList(siteUuid);
  const sourceInfoListQuery = useWaterSiteSourceInfoList(siteUuid);
  
  const filterContextProviderValue: SiteDetailsPageContextState  = {
    siteUuid,
    hostData: {
      detailsQuery,
      locationsQuery,
      waterRightInfoListQuery,
      sourceInfoListQuery
    }
  }

  return (
    <SiteDetailsContext.Provider value={filterContextProviderValue}>
      {children}
    </SiteDetailsContext.Provider>
  );
}