import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { BeneficialUseListItem } from "../../../data-contracts/BeneficialUseListItem";
import { DataPoints, Directions } from "../../../data-contracts/nldi";
import { useDisplayOptionsUrlParameters } from "./hooks/url-parameters/useDisplayOptionsUrlParameters";
import { defaultDisplayOptions, DisplayOptions } from "./DisplayOptions";
import { useFiltersUrlParameters } from "./hooks/url-parameters/useFiltersUrlParameters";
import { useBeneficialUses, useOwnerClassifications, useStates, useWaterSourceTypes } from "../../../hooks/queries/useSystemQuery";
import { useRiverBasinOptions } from "../../../hooks/queries/useRiverBasinOptions";
import { UseQueryResult } from "react-query";

export interface SiteSpecificFilters{
  beneficialUseNames?: string[],
  waterSourceTypes?: string[],
  riverBasinNames?: string[],
  states?: string[],
  podPou: "POD" | "POU" | undefined,
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
  statesQuery: Query<string[]>;
  riverBasinsQuery: Query<string[]>;
}

export interface SiteSpecificContextState {
  filters: SiteSpecificFilters;
  setFilters: React.Dispatch<React.SetStateAction<SiteSpecificFilters>>;
  nldiIds: string[];
  setNldiIds: React.Dispatch<React.SetStateAction<string[]>>;
  displayOptions: DisplayOptions;
  setDisplayOptions: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  resetUserOptions: () => void;
  hostData: HostData;
}

export const defaultFilters: SiteSpecificFilters = {
  beneficialUseNames: undefined,
  waterSourceTypes: undefined,
  states: undefined,
  riverBasinNames: undefined,
  podPou: undefined,
  polylines: undefined,
  isNldiFilterActive: false,
  nldiFilterData: undefined
}

export const defaultNldiFilters = {
  latitude: null as number | null,
  longitude: null as number | null,
  directions: Directions.Upsteam | Directions.Downsteam as Directions,
  dataPoints: DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade as DataPoints
}

export const defaultState: SiteSpecificContextState = {
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
    statesQuery: defaultQuery,
    riverBasinsQuery: defaultQuery
  },
}

const SiteSpecificContext = createContext<SiteSpecificContextState>(defaultState);
export const useSiteSpecificContext = () => useContext(SiteSpecificContext)

export const SiteSpecificProvider: FC = ({ children }) => {
  const { getParameter: getDisplayOptionsParameter, setParameter: setDisplayOptionsParameter } = useDisplayOptionsUrlParameters();
  const { getParameter: getFiltersParameter, setParameter: setFiltersParameter } = useFiltersUrlParameters();

  const [ filters, setFilters ] = useState<SiteSpecificFilters>(getFiltersParameter() ?? defaultFilters);
  const [ displayOptions, setDisplayOptions ] = useState<DisplayOptions>(getDisplayOptionsParameter() ?? defaultDisplayOptions)
  const [ nldiIds, setNldiIds ] = useState<string[]>([]);

  const beneficialUsesQuery = useBeneficialUses();
  const waterSourcesQuery = useWaterSourceTypes();
  const statesQuery = useStates();
  const riverBasinsQuery = useRiverBasinOptions();

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
      statesQuery,
      riverBasinsQuery
    }
  }

  return (
    <SiteSpecificContext.Provider value={filterContextProviderValue}>
      {children}
    </SiteSpecificContext.Provider>
  );
}