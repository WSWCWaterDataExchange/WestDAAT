import React from 'react';
import { waterRightsProperties } from "../../../../../config/constants";
import { useInFilter } from "./useInFilter";


export function useOwnerClassificationsFilter() {
  const { values, setValues, mapFilters } = useInFilter("ownerClassifications", "ownerClassificationsQuery", waterRightsProperties.ownerClassifications);
  return {
    ownerClassifications: values,
    setOwnerClassifications: setValues,
    mapFilters
  };
}
