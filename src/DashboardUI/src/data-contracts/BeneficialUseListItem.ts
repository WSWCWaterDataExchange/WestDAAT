export interface BeneficialUseListItem {
  BeneficialUseName: string;
  ConsumptionCategory: ConsumptionCategoryType;
}

export enum ConsumptionCategoryType {
  Unspecified = 0,
  Consumptive = 1,
  NonConsumptive = 2,
}