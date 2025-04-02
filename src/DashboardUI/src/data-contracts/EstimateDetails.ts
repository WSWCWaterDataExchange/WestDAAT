import { CompensationRateUnits } from './CompensationRateUnits';
import { LocationDetails } from './LocationDetails';

export interface EstimateDetails {
  id: string;
  compensationRateDollars: number;
  compensationRateUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  estimatedCompensationDollars: number;
  cumulativeTotalEtInAcreFeet: number;
  locations: LocationDetails[];
}
