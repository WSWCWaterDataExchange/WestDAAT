export interface waterRightDetails {
  allocationAmountId: number;
  allocationNativeId: string;
  allocationOwner: string;
  priorityDate: Date;
  expirationDate: Date;
  allocationLegalStatusCv: string;
  allocationFlow_CFS: number;
  allocationVolume_AF: number;
  beneficialUse: string;

  aggregationInterval: number;
  aggregationIntervalUnitCv: string;
  aggregationStatisticCv: string;
  amountUnitCv: string;
  reportYearStartMonth: string;
  reportYearTypeCv: string;
  variableCv: string;

  organizationName: string;
  state: string;
  organizationContactName: string;
  organizationContactEmail: string;
  organizationPhoneNumber: string;
  organizationWebsite: string;
}
