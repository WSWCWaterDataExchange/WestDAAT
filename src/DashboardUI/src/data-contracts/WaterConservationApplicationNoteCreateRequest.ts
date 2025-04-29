import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';

export interface WaterConservationApplicationNoteCreateRequest extends ApplicationStoreRequestBase {
  $type: 'WaterConservationApplicationNoteCreateRequest';
  waterConservationApplicationId: string;
  note: string;
}
