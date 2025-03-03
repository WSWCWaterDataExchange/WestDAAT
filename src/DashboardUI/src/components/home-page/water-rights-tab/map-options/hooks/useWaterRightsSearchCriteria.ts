import { useMemo } from 'react';
import { WaterRightsFilters, useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';
import { WaterRightsSearchCriteria } from '../../../../../data-contracts/WaterRightsSearchCriteria';
import moment from 'moment';

export function useWaterRightsSearchCriteria() {
  const { filters, nldiIds } = useWaterRightsContext();

  return useWaterRightsSearchCriteriaWithoutContext({ filters, nldiIds });
}

interface SearchCriteriaProps {
  filters: WaterRightsFilters;
  nldiIds: string[];
}
export function useWaterRightsSearchCriteriaWithoutContext({ filters, nldiIds }: SearchCriteriaProps) {
  //pulling only the fields we need out of the filters to avoid more updates than we need to do to the search criteria
  const {
    beneficialUseNames,
    polylines,
    includeExempt,
    minFlow,
    maxFlow,
    minVolume,
    maxVolume,
    podPou,
    minPriorityDate,
    maxPriorityDate,
    ownerClassifications,
    waterSourceTypes,
    riverBasinNames,
    allocationOwner,
    states,
    isWaterRightsFilterActive,
  } = filters;

  const searchCriteria: WaterRightsSearchCriteria = useMemo(() => {
    return {
      beneficialUses: beneficialUseNames,
      filterGeometry: polylines?.map((p) => JSON.stringify(p.geometry)),
      exemptofVolumeFlowPriority: includeExempt,
      minimumFlow: minFlow,
      maximumFlow: maxFlow,
      minimumVolume: minVolume,
      maximumVolume: maxVolume,
      podOrPou: podPou,
      minimumPriorityDate: minPriorityDate ? moment.unix(minPriorityDate).toDate() : undefined,
      maximumPriorityDate: maxPriorityDate ? moment.unix(maxPriorityDate).toDate() : undefined,
      ownerClassifications: ownerClassifications,
      waterSourceTypes: waterSourceTypes,
      riverBasinNames: riverBasinNames,
      allocationOwner: allocationOwner,
      states: states,
      wadeSitesUuids: nldiIds,
      isWaterRightsFilterActive: isWaterRightsFilterActive,
    };
  }, [
    beneficialUseNames,
    polylines,
    includeExempt,
    minFlow,
    maxFlow,
    minVolume,
    maxVolume,
    podPou,
    minPriorityDate,
    maxPriorityDate,
    ownerClassifications,
    waterSourceTypes,
    riverBasinNames,
    allocationOwner,
    states,
    nldiIds,
    isWaterRightsFilterActive
  ]);

  return { searchCriteria };
}
