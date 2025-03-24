import { CompensationRateUnits } from './CompensationRateUnits';

export interface ApplicationSubmissionFormData {
  landownerName: string | undefined;
  landownerEmail: string | undefined;
  landownerPhoneNumber: string | undefined;
  landownerAddress: string | undefined;
  landownerCity: string | undefined;
  landownerState: string | undefined;
  landownerZipCode: string | undefined;
  agentName: string | undefined;
  agentEmail: string | undefined;
  agentPhoneNumber: string | undefined;
  agentAdditionalDetails: string | undefined;
  fieldDetails: {
    waterConservationApplicationEstimateLocationId: string;
    additionalDetails: string;
  }[];
  canalOrIrrigationEntityName: string | undefined;
  canalOrIrrigationEntityEmail: string | undefined;
  canalOrIrrigationEntityPhoneNumber: string | undefined;
  canalOrIrrigationAdditionalDetails: string | undefined;
  permitNumber: string | undefined;
  facilityDitchName: string | undefined;
  priorityDate: string | undefined;
  certificateNumber: string | undefined;
  shareNumber: string | undefined;
  waterRightState: string | undefined;
  waterUseDescription: string | undefined;
  estimationSupplementaryDetails: string | undefined;
  conservationPlanFundingRequestDollarAmount: number | undefined;
  conservationPlanFundingRequestCompensationRateUnits:
    | Exclude<CompensationRateUnits, CompensationRateUnits.None>
    | undefined;
  conservationPlanDescription: string | undefined;
  conservationPlanAdditionalInfo: string | undefined;
}

export const defaultApplicationSubmissionFormData = (): ApplicationSubmissionFormData => {
  return {
    landownerName: undefined,
    landownerEmail: undefined,
    landownerPhoneNumber: undefined,
    landownerAddress: undefined,
    landownerCity: undefined,
    landownerState: undefined,
    landownerZipCode: undefined,
    agentName: undefined,
    agentEmail: undefined,
    agentPhoneNumber: undefined,
    agentAdditionalDetails: undefined,
    fieldDetails: [],
    canalOrIrrigationEntityName: undefined,
    canalOrIrrigationEntityEmail: undefined,
    canalOrIrrigationEntityPhoneNumber: undefined,
    canalOrIrrigationAdditionalDetails: undefined,
    permitNumber: undefined,
    facilityDitchName: undefined,
    priorityDate: undefined,
    certificateNumber: undefined,
    shareNumber: undefined,
    waterRightState: undefined,
    waterUseDescription: undefined,
    estimationSupplementaryDetails: undefined,
    conservationPlanFundingRequestDollarAmount: undefined,
    conservationPlanFundingRequestCompensationRateUnits: undefined,
    conservationPlanDescription: undefined,
    conservationPlanAdditionalInfo: undefined,
  };
};
