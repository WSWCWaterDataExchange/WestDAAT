import { ApplicationReviewNote } from './ApplicationReviewNote';
import { ApplicationStoreResponseBase } from './ApplicationStoreResponseBase';

export interface WaterConservationApplicationNoteCreateResponse extends ApplicationStoreResponseBase {
  note: ApplicationReviewNote;
}
