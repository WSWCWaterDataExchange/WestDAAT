export interface BeneficialUseListItem {
  beneficialUseName: string;
  consumptionCategory: ConsumptionCategoryType;
}

export enum ConsumptionCategoryType {
  Unspecified = 0,
  Consumptive = 1,
  NonConsumptive = 2,
}
