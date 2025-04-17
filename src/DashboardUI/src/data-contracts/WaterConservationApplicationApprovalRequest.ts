import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { ApprovalDecision } from './ApprovalDecision';

export interface WaterConservationApplicationApprovalRequest extends ApplicationStoreRequestBase {
  $type: 'WaterConservationApplicationApprovalRequest';
  waterConservationApplicationId: string;
  approvalDecision: ApprovalDecision;
  approvalNotes: string;
}
