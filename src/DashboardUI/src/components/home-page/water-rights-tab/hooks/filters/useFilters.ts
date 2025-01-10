import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { useRiverBasinFilter } from './useRiverBasinFilter';
import { useBeneficialUsesFilter } from './useBeneficialUsesFilter';
import { usePolylinesFilter } from './usePolylinesFilter';
import { useNldiFilter } from './useNldiFilter';
import { useStatesFilter } from './useStatesFilter';
import { useOwnerClassificationsFilter } from './useOwnerClassificationsFilter';
import { useWaterSourceTypesFilter } from './useWaterSourceTypesFilter';
import { useFlowFilters } from './useFlowFilters';
import { useVolumeFilters } from './useVolumeFilters';
import { usePriorityDateFilters } from './usePriorityDateFilters';
import { usePodPouFilter } from './usePodPouFilter';
import { useIncludeExemptFilter } from './useIncludeExemptFilter';
import { useAllocationOwnerFilter } from './useAllocationOwnerFilter';
import { useLegalStatusesFilter } from './useLegalStatusesFilter';
import { useSiteTypesFilter } from './useSiteTypesFilter';
import { useOverlaysFilter } from './useOverlaysFilter';

const allWaterRightsLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer,
];

export function useFilters() {
  const { setLayerFilters } = useMapContext();

  const { mapFilters: podPouMapFilters } = usePodPouFilter();
  const { mapFilters: includeExemptMapFilters } = useIncludeExemptFilter();
  const { mapFilters: beneficialUsesMapFilters } = useBeneficialUsesFilter();
  const { mapFilters: ownerClassificationsMapFilters } = useOwnerClassificationsFilter();
  const { mapFilters: waterSourceTypesMapFilters } = useWaterSourceTypesFilter();
  const { mapFilters: riverBasinMapFilters } = useRiverBasinFilter();
  const { mapFilters: statesMapFilters } = useStatesFilter();
  const { mapFilters: allocationOwnerMapFilters } = useAllocationOwnerFilter();
  const { mapFilters: flowMapFilters } = useFlowFilters();
  const { mapFilters: volumeMapFilters } = useVolumeFilters();
  const { mapFilters: priorityDateMapFilters } = usePriorityDateFilters();
  const { mapFilters: polylinesMapFilters } = usePolylinesFilter();
  const { mapFilters: nldiMapFilters } = useNldiFilter();
  const { mapFilters: allocationTypesFilter } = useAllocationOwnerFilter();
  const { mapFilters: legalStatusesFilter } = useLegalStatusesFilter();
  const { mapFilters: siteTypesFilter } = useSiteTypesFilter();
  const { mapFilters: overlaysMapFilters } = useOverlaysFilter();

  const allMapFilters = useMemo(() => {
    const filterSet = ['all'] as any[];
    const pushIfSet = (filters: any) => {
      if (filters) {
        filterSet.push(filters);
      }
    };
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
    pushIfSet(allocationTypesFilter);
    pushIfSet(legalStatusesFilter);
    pushIfSet(siteTypesFilter);
    return filterSet;
  }, [
    podPouMapFilters,
    includeExemptMapFilters,
    beneficialUsesMapFilters,
    ownerClassificationsMapFilters,
    waterSourceTypesMapFilters,
    riverBasinMapFilters,
    statesMapFilters,
    allocationOwnerMapFilters,
    flowMapFilters,
    volumeMapFilters,
    priorityDateMapFilters,
    polylinesMapFilters,
    nldiMapFilters,
    allocationTypesFilter,
    legalStatusesFilter,
    siteTypesFilter,
  ]);

  useEffect(() => {
    setLayerFilters([
      {
        layer: mapLayerNames.waterRightsPointsLayer,
        filter: allMapFilters,
      },
      {
        layer: mapLayerNames.waterRightsPolygonsLayer,
        filter: allMapFilters,
      },
      {
        layer: mapLayerNames.overlayTypesPolygonsLayer,
        filter: overlaysMapFilters
          ? ['all', ['has','oType'], overlaysMapFilters]
          : ['==','oType','_FAKE_'],
      },
      {
        layer: mapLayerNames.overlayTypesPolygonsLayer,
        filter: overlaysMapFilters
          ? ['all', ['has','oType'], overlaysMapFilters]
          : ['==','oType','_FAKE_'],
      },
    ]);
  }, [allMapFilters, overlaysMapFilters, setLayerFilters]);
}
