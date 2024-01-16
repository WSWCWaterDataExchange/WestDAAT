import { useMemo } from "react";
import { SiteSpecificFilters, useSiteSpecificContext } from "../Provider";
import { SiteSpecificSearchCriteria } from "../../../../data-contracts/SiteSpecificSearchCriteria";
import moment from "moment";

export function useSiteSpecificSearchCriteria() {
  const {filters, nldiIds} = useSiteSpecificContext();

  return useSiteSpecificSearchCriteriaWithoutContext({filters, nldiIds})
}

interface SearchCriteriaProps{
  filters: SiteSpecificFilters,
  nldiIds: string[]
}
export function useSiteSpecificSearchCriteriaWithoutContext({filters, nldiIds}: SearchCriteriaProps) {
  //pulling only the fields we need out of the filters to avoid more updates than we need to do to the search criteria
  const {
    beneficialUseNames,
    polylines,
    podPou,
    waterSourceTypes,
    riverBasinNames,
    states
  } = filters;

  const searchCriteria: SiteSpecificSearchCriteria = useMemo(()=>{
    return {
      beneficialUses: beneficialUseNames,
      filterGeometry: polylines?.map(p => JSON.stringify(p.geometry)),
      podOrPou: podPou,
      waterSourceTypes: waterSourceTypes,
      riverBasinNames: riverBasinNames,
      states: states,
      wadeSitesUuids: nldiIds
    }
  }, [beneficialUseNames, polylines, podPou, waterSourceTypes, riverBasinNames, states, nldiIds]) 

  return {searchCriteria}
}