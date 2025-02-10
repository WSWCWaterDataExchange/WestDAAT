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
