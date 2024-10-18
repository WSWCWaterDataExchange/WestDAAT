import React from 'react';
import { waterRightsProperties } from "../../../../../config/constants";
import { useInFilter } from "./useInFilter";


export function useWaterSourceTypesFilter() {
  const { values, setValues, mapFilters } = useInFilter("waterSourceTypes", "waterSourcesQuery", waterRightsProperties.waterSourceTypes);
  return {
    waterSourceTypes: values,
    setWaterSourceTypes: setValues,
    mapFilters
  };
}
