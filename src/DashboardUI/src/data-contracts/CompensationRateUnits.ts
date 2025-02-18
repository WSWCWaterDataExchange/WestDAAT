export enum CompensationRateUnits {
  None = 0,
  AcreFeet = 1,
  Acres = 2,
}

export const CompensationRateUnitsLabels: Record<CompensationRateUnits, string> = {
  [CompensationRateUnits.None]: 'None',
  [CompensationRateUnits.AcreFeet]: 'Acre-Feet',
  [CompensationRateUnits.Acres]: 'Acres',
};

export const CompensationRateUnitsOptions = Object.keys(CompensationRateUnitsLabels)
  .map((key) => Number(key) as CompensationRateUnits)
  .filter((value) => value !== CompensationRateUnits.None);
