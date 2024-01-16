export interface SiteSpecificSearchCriteria {
  beneficialUses?: string[];
  waterSourceTypes?: string[];
  riverBasinNames?: string[];
  wadeSitesUuids?: string[];
  filterGeometry?: string[];
  states?: string[];
  podOrPou?: string;
}

export interface SiteSpecificSearchCriteriaWithPaging extends SiteSpecificSearchCriteria {
  pageNumber: number;
}

export interface WaterRightsSearchCriteriaWithFilterUrl extends SiteSpecificSearchCriteria {
  filterUrl: string;
}