export interface WaterRightsSearchCriteria {
  pageNumber?: number;
  beneficialUses?: string[];
  ownerClassifications?: string[];
  waterSourceTypes?: string[];
  riverBasinNames?: string[];
  wadeSitesUuids?: string[];
  filterGeometry?: string[]; //geojson string
  states?: string[];
  allocationOwner?: string;
  expemptofVolumeFlowPriority?: boolean;
  minimumFlow?: number;
  maximumFlow?: number;
  minimumVolume?: number;
  maximumVolume?: number;
  podOrPou?: string;
  minimumPriorityDate?: Date;
  maximumPriorityDate?: Date;
  filterUrl?: string;
}