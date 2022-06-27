import { createContext, FC, useContext, useState } from "react";
import { AppContext } from "./AppProvider";
import { BeneficialUseListItem } from "./data-contracts/BeneficialUseListItem";
import { DataPoints, Directions } from "./data-contracts/nldi";

export interface WaterRightsFilters{
  beneficialUses?: BeneficialUseListItem[],
  ownerClassifications?: string[],
  waterSourceTypes?: string[],
  riverBasinNames?: string[],
  states?: string[],
  allocationOwner?: string,
  includeExempt?: boolean,
  minFlow: number | undefined,
  maxFlow: number | undefined,
  minVolume: number | undefined,
  maxVolume: number | undefined,
  podPou: "POD" | "POU" | undefined,
  minPriorityDate: number | undefined,
  maxPriorityDate: number | undefined,
  polyline: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> }[],
  nldiFilterData: { latitude: number | null, longitude: number | null, directions: Directions, dataPoints: DataPoints } | null

}

//[WaterRightsFilters, Dispatch<SetStateAction<WaterRightsFilters>>]'

interface FilterContextState {
  filters: WaterRightsFilters;
  setFilters: React.Dispatch<React.SetStateAction<WaterRightsFilters>>;
}

const defaultFilters: WaterRightsFilters = {
  beneficialUses: undefined,
  ownerClassifications: undefined,
  allocationOwner: undefined,
  waterSourceTypes: undefined,
  states: undefined,
  riverBasinNames: undefined,
  includeExempt: false,
  minFlow: undefined,
  maxFlow: undefined,
  minVolume: undefined,
  maxVolume: undefined,
  podPou: undefined,
  minPriorityDate: undefined,
  maxPriorityDate: undefined,
  polyline: [],
  nldiFilterData: null
}

const defaultState: FilterContextState = {
  filters: defaultFilters,
  setFilters: () => {}
}

export const FilterContext = createContext<FilterContextState>(defaultState);

export const FilterProvider: FC = ({ children }) => {
  const { getUrlParam } = useContext(AppContext);

  const [ filters, setFilters ] = useState<WaterRightsFilters>(getUrlParam<WaterRightsFilters>("wr") ?? defaultFilters);

  const filterContextProviderValue = {
    filters,
    setFilters
  }

  return (
    <FilterContext.Provider value={filterContextProviderValue}>
      {children}
    </FilterContext.Provider>
  );
}