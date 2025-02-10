import { CompensationRateUnits } from './CompensationRateUnits';
import { ConservationApplicationStatus } from './ConservationApplicationStatus';

export interface ApplicationDashboardListItem {
  ApplicantFullName: string;
  ApplicationDisplayId: string;
  ApplicationId: string;
  CompensationRateDollars: number;
  CompensationRateUnits: CompensationRateUnits;
  OrganizationName: string;
  Status: ConservationApplicationStatus;
  /**
   * Date the application was submitted,
   * in DateTimeOffset format
   * (ex: "2025-02-02T18:40:04.2611554+00:00")
   */
  SubmittedDate: string;
  TotalObligationDollars: number;
  TotalWaterVolumeSavingsAcreFeet: number;
  WaterRightNativeId: string;
  WaterRightState: string;
}
