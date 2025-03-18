import { CompensationRateUnits } from './CompensationRateUnits';

export interface ApplicationSubmissionForm {
  landownerName: string;
  landownerEmail: string;
  landownerPhoneNumber: string;
  landownerAddress: string;
  landownerCity: string;
  landownerState: string;
  landownerZipCode: string;
  agentName: string;
  agentEmail: string;
  agentPhoneNumber: string;
  agentAdditionalDetails: string;
  fieldDetails: {
    waterConservationApplicationEstimateLocationId: string;
    additionalDetails: string;
  }[];
  canalOrIrrigationEntityName: string;
  canalOrIrrigationEntityEmail: string;
  canalOrIrrigationEntityPhoneNumber: string;
  canalOrIrrigationAdditionalDetails: string;
  permitNumber: string;
  facilityDitchName: string;
  priorityDate: string;
  certificateNumber: string;
  shareNumber: string;
  waterRightState: string;
  waterUseDescription: string;
  estimationSupplementaryDetails: string;
  conservationPlanFundingRequestDollarAmount: number;
  conservationPlanFundingRequestCompensationRateUnits: Exclude<
    CompensationRateUnits,
    CompensationRateUnits.None
  > | null;
  conservationPlanDescription: string;
  conservationPlanAdditionalInfo: string;
}

export const defaultApplicationSubmissionForm = (): ApplicationSubmissionForm => {
  return {
    landownerName: '',
    landownerEmail: '',
    landownerPhoneNumber: '',
    landownerAddress: '',
    landownerCity: '',
    landownerState: '',
    landownerZipCode: '',
    agentName: '',
    agentEmail: '',
    agentPhoneNumber: '',
    agentAdditionalDetails: '',
    fieldDetails: [],
    canalOrIrrigationEntityName: '',
    canalOrIrrigationEntityEmail: '',
    canalOrIrrigationEntityPhoneNumber: '',
    canalOrIrrigationAdditionalDetails: '',
    permitNumber: '',
    facilityDitchName: '',
    priorityDate: '',
    certificateNumber: '',
    shareNumber: '',
    waterRightState: '',
    waterUseDescription: '',
    estimationSupplementaryDetails: '',
    conservationPlanFundingRequestDollarAmount: 0,
    conservationPlanFundingRequestCompensationRateUnits: CompensationRateUnits.AcreFeet,
    conservationPlanDescription: '',
    conservationPlanAdditionalInfo: '',
  };
};
