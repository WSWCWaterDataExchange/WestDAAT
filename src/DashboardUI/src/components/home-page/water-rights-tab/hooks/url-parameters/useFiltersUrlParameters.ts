import urlParameterKeys, {depricatedUrlParameterKeys} from "../../../../../hooks/url-parameters/urlParameterKeys";
import { useUrlParameters } from "../../../../../hooks/url-parameters/useUrlParameters";
import { WaterRightsFilters, defaultFilters } from "../../Provider";
import { useCallback, useEffect } from "react";
import { Optional } from "../../../../../HelperTypes";
import { BeneficialUseListItem } from "../../../../../data-contracts/BeneficialUseListItem";

const paramName = urlParameterKeys.homePage.waterRightsFilters;

type WaterRightsFiltersV1Type = Optional<WaterRightsFilters, 'isNldiFilterActive'> 
  & {beneficialUses?: BeneficialUseListItem[]}
  & {polyline?: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[]}

export function useFiltersUrlParameters() {
  const {getParameter: getParameterOptionalNldi, setParameter: setParameterOptionalNldi}  = useUrlParameters<WaterRightsFiltersV1Type>(paramName, defaultFilters);
  const {getParameter: getIsNldiParameterActive, setParameter: setIsNldiParameterActive} = useUrlParameters<boolean | undefined>(depricatedUrlParameterKeys.isWaterRightsNldiFilterActive, undefined)

  const setParameter = useCallback((filters: WaterRightsFilters | undefined) =>{
    setParameterOptionalNldi(filters)
  }, [setParameterOptionalNldi]);

  const getParameter = useCallback((): (WaterRightsFilters | undefined) =>{
    return getParameterOptionalNldi() as (WaterRightsFilters | undefined);
  }, [getParameterOptionalNldi]);

  useEffect(() =>{
    //migrate the old  water rights filter structure to the new structure
    let filters = getParameterOptionalNldi();
    if(filters){
      let hasUpdate = false;
      if(filters.isNldiFilterActive === undefined){
        filters = {...filters, isNldiFilterActive: getIsNldiParameterActive() || false};
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
      if(hasUpdate){
        setParameter(filters as WaterRightsFilters);
      }
    }
    setIsNldiParameterActive(undefined)
  }, [getParameterOptionalNldi, getIsNldiParameterActive, setIsNldiParameterActive, setParameter]);

  return {getParameter, setParameter}
}