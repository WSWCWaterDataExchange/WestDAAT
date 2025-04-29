import { CompensationRateUnits } from './CompensationRateUnits';
import { ConservationApplicationStatus } from './ConservationApplicationStatus';

export interface ApplicationDashboardListItem {
  applicantFullName: string;
  applicationDisplayId: string;
  applicationId: string;
  compensationRateDollars: number;
  compensationRateUnits: CompensationRateUnits;
  organizationName: string;
  status: ConservationApplicationStatus;
  submittedDate: Date;
  totalObligationDollars: number;
  totalWaterVolumeSavingsAcreFeet: number;
  waterRightNativeId: string;
  waterRightState: string;
}

export interface ApplicationDashboardStatistics {
  submittedApplications: number | null;
  approvedApplications: number | null;
  deniedApplications: number | null;
  inReviewApplications: number | null;
  cumulativeEstimatedSavingsAcreFeet: number | null;
  totalObligationDollars: number | null;
}