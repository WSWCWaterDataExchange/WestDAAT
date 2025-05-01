import { BeneficialUseListItem } from './BeneficialUseListItem';

export interface DashboardFilters {
  overlays: OverlayFilterSet;
  waterRights: WaterRightsFilterSet;
  timeSeries: TimeSeriesFilterSet;
}

export interface OverlayFilterSet {
  overlayTypes: string[];
  waterSourceTypes: string[];
  states: string[];
}

export interface WaterRightsFilterSet {
  beneficialUses: BeneficialUseListItem[];
  ownerClassifications: string[];
  allocationTypes: string[];
  legalStatuses: string[];
  siteTypes: string[];
  waterSourceTypes: string[];
  states: string[];
  riverBasins: string[];
}

export interface TimeSeriesFilterSet {
  siteTypes: string[];
  primaryUseCategories: string[];
  variableTypes: string[];
  waterSourceTypes: string[];
  states: string[];
}
