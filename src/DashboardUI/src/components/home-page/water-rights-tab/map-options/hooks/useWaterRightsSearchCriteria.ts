import { useMemo } from 'react';
import { WaterRightsFilters, useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';
import { WaterRightsSearchCriteria } from '../../../../../data-contracts/WaterRightsSearchCriteria';
import moment from 'moment';
import { DropdownOption } from '../../../../../data-contracts/DropdownOption';

export function useWaterRightsSearchCriteria() {
  const { filters, nldiIds, analyticsGroupingOption } = useWaterRightsContext();

  return useWaterRightsSearchCriteriaWithoutContext({ filters, nldiIds, analyticsGroupingOption });
}

interface SearchCriteriaProps {
  filters: WaterRightsFilters;
  nldiIds: string[];
  analyticsGroupingOption?: DropdownOption | null;
}
export function useWaterRightsSearchCriteriaWithoutContext({ filters, nldiIds, analyticsGroupingOption }: SearchCriteriaProps) {
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
    legalStatuses,
    allocationTypes,
    siteTypes,
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
      legalStatuses: legalStatuses,
      allocationTypes: allocationTypes,
      siteTypes: siteTypes,
      groupValue: analyticsGroupingOption ? Number(analyticsGroupingOption.value) : undefined,
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
    isWaterRightsFilterActive,
    legalStatuses,
    allocationTypes,
    siteTypes,
    analyticsGroupingOption
  ]);

  return { searchCriteria };
}
