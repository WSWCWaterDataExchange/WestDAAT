import { useEffect, useMemo } from "react";
import { useMapContext } from "../../../../../contexts/MapProvider";
import { mapLayerNames } from "../../../../../config/maps";
import { useRiverBasinFilter } from "./useRiverBasinFilter";
import { useBeneficialUsesFilter } from "./useBeneficialUsesFilter";
import { usePolylinesFilter } from "./usePolylinesFilter";
import { useNldiFilter } from "./useNldiFilter";
import { useStatesFilter } from "./useStatesFilter";
import { useWaterSourceTypesFilter } from "./useWaterSourceTypesFilter";
import { usePodPouFilter } from "./usePodPouFilter";

const allWaterRightsLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer
]
export function useFilters() {
  const {setLayerFilters: setMapLayerFilters} = useMapContext();

  const {mapFilters: podPouMapFilters} = usePodPouFilter();
  const {mapFilters: beneficialUsesMapFilters} = useBeneficialUsesFilter();
  const {mapFilters: waterSourceTypesMapFilters} = useWaterSourceTypesFilter();
  const {mapFilters: riverBasinMapFilters} = useRiverBasinFilter();
  const {mapFilters: statesMapFilters} = useStatesFilter();
  const {mapFilters: polylinesMapFilters} = usePolylinesFilter();
  const {mapFilters: nldiMapFilters} = useNldiFilter();

  const allMapFilters = useMemo(() => {
    const filterSet = ["all"] as any[];
    const pushIfSet = (filters: any) => {
      if (filters) {
        filterSet.push(filters);
      }
    }
    pushIfSet(podPouMapFilters);
    pushIfSet(beneficialUsesMapFilters);
    pushIfSet(waterSourceTypesMapFilters);
    pushIfSet(riverBasinMapFilters);
    pushIfSet(statesMapFilters);
    pushIfSet(polylinesMapFilters);
    pushIfSet(nldiMapFilters);
    return filterSet;
  }, [podPouMapFilters, beneficialUsesMapFilters, waterSourceTypesMapFilters, riverBasinMapFilters, statesMapFilters, polylinesMapFilters, nldiMapFilters])

  useEffect(() =>{
    setMapLayerFilters(allWaterRightsLayers.map(a => {
      return { layer: a, filter: allMapFilters }
    }));
  }, [allMapFilters, setMapLayerFilters])
}
