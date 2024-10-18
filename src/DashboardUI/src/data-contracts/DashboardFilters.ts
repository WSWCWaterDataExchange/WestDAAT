import {BeneficialUseListItem} from "./BeneficialUseListItem";

export interface DashboardFilters {
    beneficialUses: BeneficialUseListItem[];
    waterSources: string[];
    ownerClassifications: string[];
    states: string[];
    allocationTypes: string[];
    legalStatuses: string[];
    siteTypes: string[];
    riverBasins: string[];
}