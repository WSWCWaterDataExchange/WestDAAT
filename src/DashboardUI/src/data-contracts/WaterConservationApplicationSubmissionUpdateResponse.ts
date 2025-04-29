import { ApplicationReviewNote } from './ApplicationReviewNote';
import { ApplicationStoreResponseBase } from './ApplicationStoreResponseBase';

export interface WaterConservationApplicationSubmissionUpdateResponse extends ApplicationStoreResponseBase {
  note: ApplicationReviewNote;
}
