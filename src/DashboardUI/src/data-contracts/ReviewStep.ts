import { ReviewStepStatus } from './ReviewStepStatus';
import { ReviewStepType } from './ReviewStepType';

export interface ReviewStep {
  reviewStepType: ReviewStepType;
  reviewStepStatus: ReviewStepStatus;
  participantName: string;
  reviewDate: string;
}
