import { ApplicationStoreRequestBase } from './ApplicationStoreRequestBase';
import { CompensationRateUnits } from './CompensationRateUnits';

export interface WaterConservationApplicationSubmissionRequest extends ApplicationStoreRequestBase {
  waterConservationApplicationId: string;
  waterRightNativeId: string;

  agentName: string | undefined;
  agentEmail: string | undefined;
  agentPhoneNumber: string | undefined;
  agentAdditionalDetails: string | undefined;

  landownerName: string;
  landownerEmail: string;
  landownerPhoneNumber: string;
  landownerAddress: string;
  landownerCity: string;
  landownerState: string;
  landownerZipCode: string;

  canalOrIrrigationEntityName: string | undefined;
  canalOrIrrigationEntityEmail: string | undefined;
  canalOrIrrigationEntityPhoneNumber: string | undefined;
  canalOrIrrigationAdditionalDetails: string | undefined;

  conservationPlanFundingRequestDollarAmount: number;
  conservationPlanFundingRequestCompensationRateUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None>;
  conservationPlanDescription: string;
  conservationPlanAdditionalInfo: string | undefined;

  estimationSupplementaryDetails: string | undefined;

  permitNumber: string;
  facilityDitchName: string;
  priorityDate: string;
  certificateNumber: string;
  shareNumber: string;
  waterRightState: string;
  waterUseDescription: string;

  fieldDetails: {
    waterConservationApplicationEstimateLocationId: string;
    additionalDetails: string;
  }[];
}
