import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { BeneficialUseListItem } from "../../../data-contracts/BeneficialUseListItem";
import { DataPoints, Directions } from "../../../data-contracts/nldi";
import { useDisplayOptionsUrlParameters } from "./hooks/url-parameters/useDisplayOptionsUrlParameters";
import { defaultDisplayOptions, DisplayOptions } from "./DisplayOptions";
import { useFiltersUrlParameters } from "./hooks/url-parameters/useFiltersUrlParameters";
import {
  useAllocationTypes,
  useBeneficialUses,
  useOwnerClassifications,
  useStates,
  useWaterSourceTypes
} from "../../../hooks/queries/useSystemQuery";
import { useRiverBasinOptions } from "../../../hooks/queries/useRiverBasinOptions";
import { UseQueryResult } from "react-query";

export interface WaterRightsFilters{
  beneficialUseNames?: string[],
  ownerClassifications?: string[],
  waterSourceTypes?: string[],
  riverBasinNames?: string[],
  states?: string[],
  allocationOwner?: string,
  allocationTypes?: string[],
  includeExempt: boolean | undefined,
  minFlow: number | undefined,
  maxFlow: number | undefined,
  minVolume: number | undefined,
  maxVolume: number | undefined,
  podPou: "POD" | "POU" | undefined,
  minPriorityDate: number | undefined,
  maxPriorityDate: number | undefined,
  polylines?: GeoJSON.Feature<GeoJSON.Geometry>[],
  isNldiFilterActive: boolean,
  nldiFilterData?: NldiFilters,
}

export interface NldiFilters{ 
  latitude: number | null,
  longitude: number | null,
  directions: Directions,
  dataPoints: DataPoints
}

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>

const defaultQuery = {data: undefined, isError: false, isLoading: false};

export interface HostData{
  beneficialUsesQuery: Query<BeneficialUseListItem[]>;
  waterSourcesQuery: Query<string[]>;
  ownerClassificationsQuery: Query<string[]>;
  statesQuery: Query<string[]>;
  riverBasinsQuery: Query<string[]>;
  allocationTypesQuery: Query<string[]>;
}

export interface WaterRightsContextState {
  filters: WaterRightsFilters;
  setFilters: React.Dispatch<React.SetStateAction<WaterRightsFilters>>;
  nldiIds: string[];
  setNldiIds: React.Dispatch<React.SetStateAction<string[]>>;
  displayOptions: DisplayOptions;
  setDisplayOptions: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  resetUserOptions: () => void;
  hostData: HostData;
}

export const defaultFilters: WaterRightsFilters = {
  beneficialUseNames: undefined,
  ownerClassifications: undefined,
  allocationOwner: undefined,
  waterSourceTypes: undefined,
  states: undefined,
  riverBasinNames: undefined,
  includeExempt: undefined,
  minFlow: undefined,
  maxFlow: undefined,
  minVolume: undefined,
  maxVolume: undefined,
  podPou: undefined,
  minPriorityDate: undefined,
  maxPriorityDate: undefined,
  polylines: undefined,
  isNldiFilterActive: false,
  nldiFilterData: undefined,
  allocationTypes: undefined,
}

export const defaultNldiFilters = {
  latitude: null as number | null,
  longitude: null as number | null,
  directions: Directions.Upsteam | Directions.Downsteam as Directions,
  dataPoints: DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade as DataPoints
}

export const defaultState: WaterRightsContextState = {
  filters: defaultFilters,
  setFilters: () => {},
  nldiIds: [],
  setNldiIds: () => {},
  displayOptions: defaultDisplayOptions,
  setDisplayOptions: () => {},
  resetUserOptions: () => {},
  hostData: {
    beneficialUsesQuery: defaultQuery,
    waterSourcesQuery: defaultQuery,
    ownerClassificationsQuery: defaultQuery,
    statesQuery: defaultQuery,
    riverBasinsQuery: defaultQuery,
    allocationTypesQuery: defaultQuery
  },
}

const WaterRightsContext = createContext<WaterRightsContextState>(defaultState);
export const useWaterRightsContext = () => useContext(WaterRightsContext)

export const WaterRightsProvider: FC = ({ children }) => {
  const { getParameter: getDisplayOptionsParameter, setParameter: setDisplayOptionsParameter } = useDisplayOptionsUrlParameters();
  const { getParameter: getFiltersParameter, setParameter: setFiltersParameter } = useFiltersUrlParameters();

  const [ filters, setFilters ] = useState<WaterRightsFilters>(getFiltersParameter() ?? defaultFilters);
  const [ displayOptions, setDisplayOptions ] = useState<DisplayOptions>(getDisplayOptionsParameter() ?? defaultDisplayOptions)
  const [ nldiIds, setNldiIds ] = useState<string[]>([]);

  const beneficialUsesQuery = useBeneficialUses();
  const waterSourcesQuery = useWaterSourceTypes();
  const ownerClassificationsQuery = useOwnerClassifications();
  const statesQuery = useStates();
  const riverBasinsQuery = useRiverBasinOptions();
  const allocationTypesQuery = useAllocationTypes();

  useEffect(() =>{
    setDisplayOptionsParameter(displayOptions);
  }, [displayOptions, setDisplayOptionsParameter])

  useEffect(() =>{
    setFiltersParameter(filters);
  }, [filters, setFiltersParameter])

  const resetUserOptions = useCallback(() =>{
    setFilters(defaultFilters);
    setDisplayOptions(defaultDisplayOptions);
    setNldiIds([]);
  }, [setFilters, setDisplayOptions]);


  const filterContextProviderValue = {
    filters,
    setFilters,
    nldiIds,
    setNldiIds,
    displayOptions,
    setDisplayOptions,
    resetUserOptions,
    hostData: {
      beneficialUsesQuery,
      waterSourcesQuery,
      ownerClassificationsQuery,
      statesQuery,
      riverBasinsQuery,
      allocationTypesQuery,
    }
  }

  return (
    <WaterRightsContext.Provider value={filterContextProviderValue}>
      {children}
    </WaterRightsContext.Provider>
  );
}