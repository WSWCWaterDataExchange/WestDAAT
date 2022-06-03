export interface WaterRightDetails {
  aggregationInterval: number;
  aggregationIntervalUnit: string;
  aggregationStatistic: string;
  amountUnitCv: string;
  reportYearStartMonth: string;
  reportYearTypeCv: string;
  variableCv: string;
  variableSpecific: string;

  organizationName: string;
  state: string;
  organizationWebsite: string;

  applicableResourceType: string;
  methodType: string;
  methodLink: string;
  methodDescription: string;

  allocationAmountId: number;
  allocationNativeId: string;
  allocationOwner: string;
  priorityDate: Date;
  expirationDate: Date;
  allocationLegalStatus: string;
  allocationFlowCfs: number;
  allocationVolumeAF: number;
  beneficialUses: string[];
}
