import { ApplicationLoadRequestBase } from './ApplicationLoadRequestBase';

export interface ApplicantConservationApplicationLoadRequest extends ApplicationLoadRequestBase {
  $type: 'ApplicantConservationApplicationLoadRequest';
  applicationId: string;
}
