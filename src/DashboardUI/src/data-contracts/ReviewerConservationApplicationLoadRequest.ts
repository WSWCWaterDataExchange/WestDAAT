import { ApplicationLoadRequestBase } from './ApplicationLoadRequestBase';

export interface ReviewerConservationApplicationLoadRequest extends ApplicationLoadRequestBase {
  $type: 'ReviewerConservationApplicationLoadRequest';
  applicationId: string;
}
