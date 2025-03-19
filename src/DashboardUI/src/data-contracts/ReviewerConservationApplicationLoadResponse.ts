import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationLoadResponseBase } from './ApplicationLoadResponseBase';
import { ApplicationReviewNote } from './ApplicationReviewNote';

export interface ReviewerConservationApplicationLoadResponse extends ApplicationLoadResponseBase {
  application: ApplicationDetails;
  notes: ApplicationReviewNote[];
}
