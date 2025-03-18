import { ConsumptiveUseDetails } from './ConsumptiveUseDetails';

export interface LocationDetails {
  id: string;
  polygonWkt: string;
  polygonAreaInAcres: number;
  additionalDetails: string | null;
  consumptiveUses: ConsumptiveUseDetails[];
}
