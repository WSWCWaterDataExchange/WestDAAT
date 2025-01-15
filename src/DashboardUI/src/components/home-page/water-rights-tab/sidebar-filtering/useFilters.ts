import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../config/maps';
import { useRiverBasinFilter } from './water-rights/hooks/useRiverBasinFilter';
import { useBeneficialUsesFilter } from './water-rights/hooks/useBeneficialUsesFilter';
import { usePolylinesFilter } from '../map-options/hooks/usePolylinesFilter';
import { useNldiFilter } from './nldi/hooks/useNldiFilter';
import { useStatesFilter } from './water-rights/hooks/useStatesFilter';
import { useOwnerClassificationsFilter } from './water-rights/hooks/useOwnerClassificationsFilter';
import { useWaterSourceTypesFilter } from './water-rights/hooks/useWaterSourceTypesFilter';
import { useFlowFilters } from './water-rights/hooks/useFlowFilters';
import { useVolumeFilters } from './water-rights/hooks/useVolumeFilters';
import { usePriorityDateFilters } from './water-rights/hooks/usePriorityDateFilters';
import { usePodPouFilter } from '../map-options/hooks/usePodPouFilter';
import { useIncludeExemptFilter } from './water-rights/hooks/useIncludeExemptFilter';
import { useAllocationOwnerFilter } from './water-rights/hooks/useAllocationOwnerFilter';
import { useLegalStatusesFilter } from './water-rights/hooks/useLegalStatusesFilter';
import { useSiteTypesFilter } from './water-rights/hooks/useSiteTypesFilter';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';

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
      },
      {
        layer: mapLayerNames.overlayTypesPolygonsLayer,
        filter: overlaysMapFilters
      },
    ]);
  }, [allMapFilters, overlaysMapFilters, setLayerFilters]);
}
