import { useMemo } from 'react';
import { useWaterRightsContext } from '../../WaterRightsProvider';
import { useLegalStatusesFilter } from './useLegalStatusesFilter';
import { useAllocationOwnerFilter } from './useAllocationOwnerFilter';
import { useBeneficialUsesFilter } from './useBeneficialUsesFilter';
import { useFlowFilters } from './useFlowFilters';
import { useIncludeExemptFilter } from './useIncludeExemptFilter';
import { useNldiFilter } from '../../nldi/hooks/useNldiFilter';
import { useOwnerClassificationsFilter } from './useOwnerClassificationsFilter';
import { usePodPouFilter } from '../../../map-options/hooks/usePodPouFilter';
import { usePolylinesFilter } from '../../../map-options/hooks/usePolylinesFilter';
import { usePriorityDateFilters } from './usePriorityDateFilters';
import { useRiverBasinFilter } from './useRiverBasinFilter';
import { useSiteTypesFilter } from './useSiteTypesFilter';
import { useStatesFilter } from './useStatesFilter';
import { useVolumeFilters } from './useVolumeFilters';
import { useWaterSourceTypesFilter } from './useWaterSourceTypesFilter';
import { useAllocationTypesFilter } from './useAllocationTypesFilter';

export function useWaterRightsFilter() {
  const { filters } = useWaterRightsContext();
  const { isWaterRightsFilterActive } = filters;

  const { mapFilters: podPouMapFilters } = usePodPouFilter();
  const { mapFilters: includeExemptMapFilters } = useIncludeExemptFilter();
  const { mapFilters: beneficialUsesMapFilters } = useBeneficialUsesFilter();
  const { mapFilters: ownerClassificationsMapFilters } = useOwnerClassificationsFilter();
  const { mapFilters: waterSourceTypesMapFilters } = useWaterSourceTypesFilter();
  const { mapFilters: riverBasinMapFilters } = useRiverBasinFilter();
  const { mapFilters: statesMapFilters } = useStatesFilter();
  const { mapFilters: allocationOwnerMapFilters } = useAllocationOwnerFilter();
  const { mapFilters: allocationTypesMapFilters } = useAllocationTypesFilter();
  const { mapFilters: flowMapFilters } = useFlowFilters();
  const { mapFilters: volumeMapFilters } = useVolumeFilters();
  const { mapFilters: priorityDateMapFilters } = usePriorityDateFilters();
  const { mapFilters: polylinesMapFilters } = usePolylinesFilter();
  const { mapFilters: nldiMapFilters } = useNldiFilter();
  const { mapFilters: legalStatusesFilter } = useLegalStatusesFilter();
  const { mapFilters: siteTypesFilter } = useSiteTypesFilter();

  return useMemo(() => {
    if (!isWaterRightsFilterActive) {
      return [];
    }

    const rawFilters = [
      podPouMapFilters,
      includeExemptMapFilters,
      beneficialUsesMapFilters,
      ownerClassificationsMapFilters,
      waterSourceTypesMapFilters,
      riverBasinMapFilters,
      statesMapFilters,
      allocationOwnerMapFilters,
      allocationTypesMapFilters,
      flowMapFilters,
      volumeMapFilters,
      priorityDateMapFilters,
      polylinesMapFilters,
      nldiMapFilters,
      legalStatusesFilter,
      siteTypesFilter,
    ];

    return rawFilters.filter((filter) => Array.isArray(filter) && filter.length > 0);
  }, [
    isWaterRightsFilterActive,
    podPouMapFilters,
    includeExemptMapFilters,
    beneficialUsesMapFilters,
    ownerClassificationsMapFilters,
    waterSourceTypesMapFilters,
    riverBasinMapFilters,
    statesMapFilters,
    allocationOwnerMapFilters,
    allocationTypesMapFilters,
    flowMapFilters,
    volumeMapFilters,
    priorityDateMapFilters,
    polylinesMapFilters,
    nldiMapFilters,
    legalStatusesFilter,
    siteTypesFilter,
  ]);
}
