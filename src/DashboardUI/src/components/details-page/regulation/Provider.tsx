import { useParams } from "react-router-dom";
import { createContext, FC, useContext, useState } from "react";
import { UseQueryResult } from "react-query";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import {
  useWaterRightSiteLocations,
  useRegulationDetails,
  useWaterRightInfoList,
  useRegulatoryOverlayInfoList,
} from "../../../hooks/queries";
import {
  RegulationDetails,
  RegulatoryOverlayInfoListItem,
  WaterRightInfoListItem,
} from "@data-contracts";

type Query<T> = Pick<
  UseQueryResult<T, unknown>,
  "data" | "isError" | "isLoading"
>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export interface HostData {
  detailsQuery: Query<RegulationDetails>;
  locationsQuery: Query<FeatureCollection<Geometry, GeoJsonProperties>>;
  regulatoryOverlayInfoListQuery: Query<RegulatoryOverlayInfoListItem[]>;
  waterRightInfoListQuery: Query<WaterRightInfoListItem[]>;
}

type ActiveTabType = "right" | "regulatory";

interface RegulationDetailsPageContextState {
  allocationUuid: string | undefined;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hostData: HostData;
}

const defaultState: RegulationDetailsPageContextState = {
  allocationUuid: undefined,
  activeTab: "regulatory",
  setActiveTab: () => {},
  hostData: {
    detailsQuery: defaultQuery,
    locationsQuery: defaultQuery,
    regulatoryOverlayInfoListQuery: defaultQuery,
    waterRightInfoListQuery: defaultQuery,
  },
};

const RegulationDetailsContext =
  createContext<RegulationDetailsPageContextState>(defaultState);
export const useRegulationDetailsContext = () =>
  useContext(RegulationDetailsContext);

export const RegulationDetailsProvider: FC = ({ children }) => {
  const { id: areaUuid } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTabType>(
    defaultState.activeTab,
  );

  const detailsQuery = useRegulationDetails(areaUuid);
  const regulationLocationsQuery = useWaterRightSiteLocations(areaUuid); // TODO: Create a hook for RegulatoryOverlay
  const regulatoryOverlayInfoListQuery = useRegulatoryOverlayInfoList(
    areaUuid,
    {
      enabled: activeTab === "regulatory",
    },
  );
  const waterRightInfoListQuery = useWaterRightInfoList(areaUuid, {
    enabled: activeTab === "right",
  });

  const filterContextProviderValue: RegulationDetailsPageContextState = {
    allocationUuid: areaUuid,
    activeTab,
    setActiveTab,
    hostData: {
      detailsQuery: detailsQuery,
      locationsQuery: regulationLocationsQuery,
      regulatoryOverlayInfoListQuery: regulatoryOverlayInfoListQuery,
      waterRightInfoListQuery: waterRightInfoListQuery,
    },
  };

  return (
    <RegulationDetailsContext.Provider value={filterContextProviderValue}>
      {children}
    </RegulationDetailsContext.Provider>
  );
};
