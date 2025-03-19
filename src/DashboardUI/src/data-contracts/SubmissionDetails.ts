import { CompensationRateUnits } from './CompensationRateUnits';

export interface SubmissionDetails {
  id: string;
  submittedDate: string;
  acceptedDate: string | null;
  rejectedDate: string | null;

  agentName: string | null;
  agentEmail: string | null;
  agentPhoneNumber: string | null;
  agentAdditionalDetails: string | null;

  landownerName: string;
  landownerEmail: string;
  landownerPhoneNumber: string;
  landownerAddress: string;
  landownerCity: string;
  landownerState: string;
  landownerZipCode: string;

  canalOrIrrigationEntityName: string | null;
  canalOrIrrigationEntityEmail: string | null;
  canalOrIrrigationEntityPhoneNumber: string | null;
  canalOrIrrigationAdditionalDetails: string | null;

  conservationPlanFundingRequestDollarAmount: number;
  conservationPlanFundingRequestCompensationRateUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None>;
  conservationPlanDescription: string;
  conservationPlanAdditionalInfo: string | null;

  estimationSupplementaryDetails: string | null;

  permitNumber: string;
  facilityDitchName: string;
  priorityDate: string;
  certificateNumber: string;
  shareNumber: string;
  waterRightState: string;
  waterUseDescription: string;
}
