import { BeneficialUseListItem } from './BeneficialUseListItem';

export interface DashboardFilters {
  beneficialUses: BeneficialUseListItem[];
  waterSources: string[];
  overlays: string[];
  ownerClassifications: string[];
  primaryUseCategories: string[];
  states: string[];
  allocationTypes: string[];
  legalStatuses: string[];
  siteTypes: string[];
  riverBasins: string[];
  variableTypes: string[];
}
