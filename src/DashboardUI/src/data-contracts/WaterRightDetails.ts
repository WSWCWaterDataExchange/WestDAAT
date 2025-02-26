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
  waDEDataMappingUrl: string;

  allocationUuid: string;
  allocationNativeId: string;
  allocationOwner: string;
  priorityDate: Date;
  expirationDate: Date;
  allocationLegalStatus: string;
  allocationFlowCfs: number;
  allocationVolumeAF: number;
  beneficialUses: string[];

  datePublished: Date;
  allocationTimeframeStart: string;
  allocationTimeframeEnd: string;
  allocationCropDutyAmount: number;
  waterAllocationNativeUrl: string;
  ownerClassificationCV: string;
  primaryBeneficialUseCategory: string;
  irrigationMethodCV: string;
  irrigatedAcreage: number;
  cropTypeCV: string;
  waDEIrrigationMethod: string;

  isConservationApplicationEligible: boolean;
}
