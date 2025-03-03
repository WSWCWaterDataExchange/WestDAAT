export enum CompensationRateUnits {
  None = 0,
  AcreFeet = 1,
  Acres = 2,
}

export const CompensationRateUnitsLabelsPlural: Record<CompensationRateUnits, string> = {
  [CompensationRateUnits.None]: 'None',
  [CompensationRateUnits.AcreFeet]: 'Acre-Feet',
  [CompensationRateUnits.Acres]: 'Acres',
};

export const CompensationRateUnitsLabelsSingular: Record<CompensationRateUnits, string> = {
  [CompensationRateUnits.None]: 'None',
  [CompensationRateUnits.AcreFeet]: 'Acre-Foot',
  [CompensationRateUnits.Acres]: 'Acre',
};

export const CompensationRateUnitsOptions = Object.keys(CompensationRateUnitsLabelsPlural)
  .map((key) => Number(key) as CompensationRateUnits)
  .filter((value) => value !== CompensationRateUnits.None);
