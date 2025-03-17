import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationLoadResponseBase } from './ApplicationLoadResponseBase';

export interface ApplicantConservationApplicationLoadResponse extends ApplicationLoadResponseBase {
  application: ApplicationDetails;
}
