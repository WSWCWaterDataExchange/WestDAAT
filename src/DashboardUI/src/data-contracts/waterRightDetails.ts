export interface waterRightDetails {
  allocationAmountId: number;
  allocationNativeId: string;
  allocationOwner: string;
  priorityDate: Date;
  expirationDate: Date;
  allocationLegalStatus: string;
  allocationFlowCfs: number;
  allocationVolumeAF: number;
  beneficialUse: string;

  aggregationInterval: number;
  aggregationIntervalUnit: string;
  aggregationStatistic: string;
  amountUnitCv: string;
  reportYearStartMonth: string;
  reportYearType: string;
  variableCv: string;

  organizationName: string;
  state: string;
  organizationContactName: string;
  organizationContactEmail: string;
  organizationPhoneNumber: string;
  organizationWebsite: string;
}
