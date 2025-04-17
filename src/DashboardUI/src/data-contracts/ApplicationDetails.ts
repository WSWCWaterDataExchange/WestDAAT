import { ConservationApplicationStatus } from './ConservationApplicationStatus';
import { EstimateDetails } from './EstimateDetails';
import { SubmissionDetails } from './SubmissionDetails';
import { SupportingDocumentDetails } from './SupportingDocumentDetails';

export interface ApplicationDetails {
  id: string;
  applicantUserId: string;
  fundingOrganizationId: string;
  waterRightNativeId: string;
  applicationDisplayId: string;
  estimate: EstimateDetails;
  submission: SubmissionDetails;
  supportingDocuments: SupportingDocumentDetails[];
  status: ConservationApplicationStatus;
}
