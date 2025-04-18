import urlParameterKeys, { depricatedUrlParameterKeys } from '../../../../../hooks/url-parameters/urlParameterKeys';
import { useUrlParameters } from '../../../../../hooks/url-parameters/useUrlParameters';
import { WaterRightsFilters, defaultWaterRightsFilters } from '../../sidebar-filtering/WaterRightsProvider';
import { useCallback, useEffect } from 'react';
import { Optional } from '../../../../../HelperTypes';
import { BeneficialUseListItem } from '@data-contracts';

const paramName = urlParameterKeys.homePage.waterRightsFilters;

type WaterRightsFiltersV1Type = Optional<WaterRightsFilters, 'isNldiFilterActive'> & {
  beneficialUses?: BeneficialUseListItem[];
} & {
  polyline?: { identifier: string; data: GeoJSON.Feature<GeoJSON.Geometry> }[];
};

export function useFiltersUrlParameters() {
  const { getParameter: getParameterOptionalNldi, setParameter: setParameterOptionalNldi } =
    useUrlParameters<WaterRightsFiltersV1Type>(paramName, defaultWaterRightsFilters);
  const { getParameter: getIsNldiParameterActive, setParameter: setIsNldiParameterActive } = useUrlParameters<
    boolean | undefined
  >(depricatedUrlParameterKeys.isWaterRightsNldiFilterActive, undefined);

  const setParameter = useCallback(
    (filters: WaterRightsFilters | undefined) => {
      if (filters === undefined) {
        setParameterOptionalNldi(undefined);
        return;
      }
      const slimmedFilters: WaterRightsFilters = {
        ...filters,
        allocationOwner:
          (filters.allocationOwner?.trim().length ?? 0) > 0
            ? filters.allocationOwner?.trim()
            : defaultWaterRightsFilters.allocationOwner,
        beneficialUseNames:
          (filters.beneficialUseNames?.length ?? 0) > 0
            ? filters.beneficialUseNames
            : defaultWaterRightsFilters.beneficialUseNames,
        nldiFilterData: filters.isNldiFilterActive ? filters.nldiFilterData : defaultWaterRightsFilters.nldiFilterData,
        ownerClassifications:
          (filters.ownerClassifications?.length ?? 0) > 0
            ? filters.ownerClassifications
            : defaultWaterRightsFilters.ownerClassifications,
        polylines: (filters.polylines?.length ?? 0) > 0 ? filters.polylines : defaultWaterRightsFilters.polylines,
        riverBasinNames:
          (filters.riverBasinNames?.length ?? 0) > 0
            ? filters.riverBasinNames
            : defaultWaterRightsFilters.riverBasinNames,
        states: (filters.states?.length ?? 0) > 0 ? filters.states : defaultWaterRightsFilters.states,
        waterSourceTypes:
          (filters.waterSourceTypes?.length ?? 0) > 0
            ? filters.waterSourceTypes
            : defaultWaterRightsFilters.waterSourceTypes,
      };
      setParameterOptionalNldi(slimmedFilters);
    },
    [setParameterOptionalNldi],
  );

  const migrateFilterData = useCallback(() => {
    //migrate the old  water rights filter structure to the new structure
    let filters = getParameterOptionalNldi();
    let hasUpdate = false;
    if (filters) {
      if (filters.isNldiFilterActive === undefined) {
        filters = {
          ...filters,
          isNldiFilterActive: getIsNldiParameterActive() || false,
        };
        hasUpdate = true;
      }
      if (filters.nldiFilterData === null) {
        filters = { ...filters, nldiFilterData: undefined };
        hasUpdate = true;
      }
      if (filters.beneficialUses) {
        const migratedBeneficialUseNames =
          filters.beneficialUseNames ||
          (filters.beneficialUses.length > 0 ? filters.beneficialUses.map((a) => a.beneficialUseName) : undefined);
        filters = {
          ...filters,
          beneficialUseNames: migratedBeneficialUseNames,
          beneficialUses: undefined,
        };
        hasUpdate = true;
      }
      if (filters.polyline) {
        const migratedPolylines =
          filters.polylines || (filters.polyline.length > 0 ? filters.polyline.map((a) => a.data) : undefined);
        filters = {
          ...filters,
          polylines: migratedPolylines,
          polyline: undefined,
        };
        hasUpdate = true;
      }
    }
    return { filters: filters as WaterRightsFilters | undefined, hasUpdate };
  }, [getIsNldiParameterActive, getParameterOptionalNldi]);

  const getParameter = useCallback((): WaterRightsFilters | undefined => {
    return migrateFilterData().filters;
  }, [migrateFilterData]);

  useEffect(() => {
    const { filters, hasUpdate } = migrateFilterData();
    if (hasUpdate) {
      setParameter(filters);
    }
    setIsNldiParameterActive(undefined);
  }, [migrateFilterData, setIsNldiParameterActive, setParameter]);

  return { getParameter, setParameter };
}
