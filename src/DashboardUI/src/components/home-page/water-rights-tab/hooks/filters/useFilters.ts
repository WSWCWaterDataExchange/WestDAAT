import { useContext, useEffect, useMemo } from "react";
import { MapContext } from "../../../../../contexts/MapProvider";
import { mapLayerNames } from "../../../../../config/maps";
import { useRiverBasinFilter } from "./useRiverBasinFilter";
import { useBeneficialUsesFilter } from "./useBeneficialUsesFilter";
import { usePolylinesFilter } from "./usePolylinesFilter";
import { useNldiFilter } from "./useNldiFilter";
import { useStatesFilter } from "./useStatesFilter";
import { useOwnerClassificationsFilter } from "./useOwnerClassificationsFilter";
import { useWaterSourceTypesFilter } from "./useWaterSourceTypesFilter";
import { useFlowFilters } from "./useFlowFilters";
import { useVolumeFilters } from "./useVolumeFilters";
import { usePriorityDateFilters } from "./usePriorityDateFilters";
import { usePodPouFilter } from "./usePodPouFilter";
import { useIncludeExemptFilter } from "./useIncludeExemptFilter";
import { useAllocationOwnerFilter } from "./useAllocationOwnerFilter";

const allWaterRightsLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer
]
export function useFilters() {
  const {setLayerFilters: setMapLayerFilters} = useContext(MapContext);

  const {mapFilters: podPouMapFilters} = usePodPouFilter();
  const {mapFilters: includeExemptMapFilters} = useIncludeExemptFilter();
  const {mapFilters: beneficialUsesMapFilters} = useBeneficialUsesFilter();
  const {mapFilters: ownerClassificationsMapFilters} = useOwnerClassificationsFilter();
  const {mapFilters: waterSourceTypesMapFilters} = useWaterSourceTypesFilter();
  const {mapFilters: riverBasinMapFilters} = useRiverBasinFilter();
  const {mapFilters: statesMapFilters} = useStatesFilter();
  const {mapFilters: allocationOwnerMapFilters} = useAllocationOwnerFilter();
  const {mapFilters: flowMapFilters} = useFlowFilters();
  const {mapFilters: volumeMapFilters} = useVolumeFilters();
  const {mapFilters: priorityDateMapFilters} = usePriorityDateFilters();
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
    pushIfSet(includeExemptMapFilters);
    pushIfSet(beneficialUsesMapFilters);
    pushIfSet(ownerClassificationsMapFilters);
    pushIfSet(waterSourceTypesMapFilters);
    pushIfSet(riverBasinMapFilters);
    pushIfSet(statesMapFilters);
    pushIfSet(allocationOwnerMapFilters);
    pushIfSet(flowMapFilters);
    pushIfSet(volumeMapFilters);
    pushIfSet(priorityDateMapFilters);
    pushIfSet(polylinesMapFilters);
    pushIfSet(nldiMapFilters);
    return filterSet;
  }, [podPouMapFilters, includeExemptMapFilters, beneficialUsesMapFilters, ownerClassificationsMapFilters, waterSourceTypesMapFilters, riverBasinMapFilters, statesMapFilters, allocationOwnerMapFilters, flowMapFilters, volumeMapFilters, priorityDateMapFilters, polylinesMapFilters, nldiMapFilters])

  useEffect(() =>{
    setMapLayerFilters(allWaterRightsLayers.map(a => {
      return { layer: a, filter: allMapFilters }
    }));
  }, [allMapFilters, setMapLayerFilters])
}
