import urlParameterKeys, {depricatedUrlParameterKeys} from "../../../../../hooks/url-parameters/urlParameterKeys";
import { useUrlParameters } from "../../../../../hooks/url-parameters/useUrlParameters";
import { SiteSpecificFilters, defaultFilters } from "../../Provider";
import { useCallback, useEffect } from "react";
import { Optional } from "../../../../../HelperTypes";
import { BeneficialUseListItem } from "../../../../../data-contracts/BeneficialUseListItem";

const paramName = urlParameterKeys.siteSpecificPage.siteSpecificFilters;

type WaterRightsFiltersV1Type = Optional<SiteSpecificFilters, 'isNldiFilterActive'> 
  & {beneficialUses?: BeneficialUseListItem[]}
  & {polyline?: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[]}

export function useFiltersUrlParameters() {
  const {getParameter: getParameterOptionalNldi, setParameter: setParameterOptionalNldi}  = useUrlParameters<WaterRightsFiltersV1Type>(paramName, defaultFilters);
  const {getParameter: getIsNldiParameterActive, setParameter: setIsNldiParameterActive} = useUrlParameters<boolean | undefined>(depricatedUrlParameterKeys.isWaterRightsNldiFilterActive, undefined)

  const setParameter = useCallback((filters: SiteSpecificFilters | undefined) =>{
    if(filters === undefined){
      setParameterOptionalNldi(undefined);
      return;
    }
    const slimmedFilters: SiteSpecificFilters = {
      ...filters,
      beneficialUseNames: (filters.beneficialUseNames?.length ?? 0) > 0 ? filters.beneficialUseNames : defaultFilters.beneficialUseNames,
      nldiFilterData: filters.isNldiFilterActive ? filters.nldiFilterData : defaultFilters.nldiFilterData,
      polylines: (filters.polylines?.length ?? 0) > 0 ? filters.polylines : defaultFilters.polylines,
      riverBasinNames: (filters.riverBasinNames?.length ?? 0) > 0 ? filters.riverBasinNames : defaultFilters.riverBasinNames,
      states: (filters.states?.length ?? 0) > 0 ? filters.states : defaultFilters.states,
      waterSourceTypes: (filters.waterSourceTypes?.length ?? 0) > 0 ? filters.waterSourceTypes :  defaultFilters.waterSourceTypes,
    }
    setParameterOptionalNldi(slimmedFilters);
  }, [setParameterOptionalNldi]);

  const migrateFilterData = useCallback(() => {
    //migrate the old  water rights filter structure to the new structure
    let filters = getParameterOptionalNldi();
    let hasUpdate = false;
    if(filters){
      if(filters.isNldiFilterActive === undefined){
        filters = {...filters, isNldiFilterActive: getIsNldiParameterActive() || false};
        hasUpdate = true;
      }
      if(filters.nldiFilterData === null){
        filters = {...filters, nldiFilterData: undefined};
        hasUpdate = true;
      }
      if(filters.beneficialUses){
        let migratedBeneficialUseNames = 
          filters.beneficialUseNames || 
          (filters.beneficialUses.length > 0 ? filters.beneficialUses.map(a=> a.beneficialUseName) : undefined);
        filters = {
          ...filters,
          beneficialUseNames: migratedBeneficialUseNames,
          beneficialUses: undefined
        }
        hasUpdate = true;
      }
      if(filters.polyline){
        let migratedPolylines = 
          filters.polylines || 
          (filters.polyline.length > 0 ? filters.polyline.map(a=> a.data) : undefined);
        filters = {
          ...filters,
          polylines: migratedPolylines,
          polyline: undefined
        }
        hasUpdate = true;
      }
    }
    return {filters: filters as SiteSpecificFilters | undefined, hasUpdate};
  }, [getIsNldiParameterActive, getParameterOptionalNldi])

  const getParameter = useCallback((): (SiteSpecificFilters | undefined) =>{
    return migrateFilterData().filters;
  }, [migrateFilterData]);

  useEffect(() =>{
    const {filters, hasUpdate} = migrateFilterData();
    if(hasUpdate){
      setParameter(filters);
    }
    setIsNldiParameterActive(undefined)
  }, [migrateFilterData, setIsNldiParameterActive, setParameter]);

  return {getParameter, setParameter}
}