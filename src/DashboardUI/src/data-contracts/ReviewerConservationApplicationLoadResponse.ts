import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationLoadResponseBase } from './ApplicationLoadResponseBase';
import { ApplicationReviewNote } from './ApplicationReviewNote';
import { ReviewPipeline } from './ReviewPipeline';

export interface ReviewerConservationApplicationLoadResponse extends ApplicationLoadResponseBase {
  application: ApplicationDetails;
  notes: ApplicationReviewNote[];
  reviewPipeline: ReviewPipeline;
}
