export interface WaterRightsSearchCriteria {
  beneficialUses?: string[];
  ownerClassifications?: string[];
  waterSourceTypes?: string[];
  riverBasinNames?: string[];
  wadeSitesUuids?: string[];
  filterGeometry?: string[]; //geojson string
  states?: string[];
  allocationOwner?: string;
  exemptofVolumeFlowPriority?: boolean;
  minimumFlow?: number;
  maximumFlow?: number;
  minimumVolume?: number;
  maximumVolume?: number;
  podOrPou?: string;
  minimumPriorityDate?: Date;
  maximumPriorityDate?: Date;
}

export interface WaterRightsSearchCriteriaWithPaging extends WaterRightsSearchCriteria {
  pageNumber: number;
}

export interface WaterRightsSearchCriteriaWithFilterUrl extends WaterRightsSearchCriteria {
  filterUrl: string;
}

export interface WaterRightsSearchCriteriaWithGrouping extends WaterRightsSearchCriteria {
  groupValue?: number;
}
