import { CompensationRateUnits } from './CompensationRateUnits';
import { LocationDetails } from './LocationDetails';

export interface EstimateDetails {
  id: string;
  compensationRateDollars: number;
  compensationRateUnits: CompensationRateUnits;
  estimatedCompensationDollars: number;
  totalAverageYearlyConsumptionEtAcreFeet: number;
  locations: LocationDetails[];
}
