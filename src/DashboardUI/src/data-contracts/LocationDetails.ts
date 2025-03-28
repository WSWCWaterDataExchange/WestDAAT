import { ConsumptiveUseDetails } from './ConsumptiveUseDetails';
import { DrawToolType } from './DrawToolType';

export interface LocationDetails {
  id: string;
  polygonWkt: string;
  drawToolType: DrawToolType;
  polygonAreaInAcres: number;
  additionalDetails: string | null;
  consumptiveUses: ConsumptiveUseDetails[];
}
