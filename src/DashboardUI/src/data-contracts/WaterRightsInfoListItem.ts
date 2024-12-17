export interface WaterRightsInfoListItem {
  AllocationUuid: string;
  WaterRightNativeId: string;
  Owner: string;
  PriorityDate?: Date;
  ExpirationDate?: Date;
  LegalStatus: string;
  Flow?: number;
  Volume?: number;
  BeneficialUses: string[];
}
