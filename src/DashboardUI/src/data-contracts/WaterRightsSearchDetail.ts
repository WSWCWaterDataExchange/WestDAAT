export interface WaterRightsSearchDetail {
  allocationUuid: string;
  allocationPriorityDate?: Date;
  beneficialUses: string[];
  allocationFlowCfs?: number | null;
  allocationVolumeAf?: number | null;
  allocationLegalStatus: string;
  ownerClassification: string;
  allocationOwner: string;
}
