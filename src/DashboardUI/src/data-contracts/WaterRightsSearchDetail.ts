export interface WaterRightsSearchDetail {
  allocationUuid: string;
  allocationPriorityDate?: Date;
  beneficialUses: string[];
  allocationFlowCfs?: number;
  allocationVolumeAf?: number;
  allocationLegalStatus: string;
  ownerClassification: string;
  allocationOwner: string;
}
