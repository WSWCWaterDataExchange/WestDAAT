export enum CompensationRateUnits {
  None = 0,
  AcreFeet = 1,
  Acres = 2,
}

export function formatCompensationRateUnitsText(units: CompensationRateUnits): string {
  switch (units) {
    case CompensationRateUnits.AcreFeet:
      return 'Acre-Feet';
    case CompensationRateUnits.Acres:
      return 'Acre';
    case CompensationRateUnits.None:
      return 'None';
  }
}