export interface WaterRightInfoListItem {
  waterRightId: number;
  waterRightNativeId: string;
  owner: string;
  priorityDate: Date;
  expirationDate: Date;
  legalStatus: string;
  flow: number;
  volume: number;
  beneficialUses: string[];
}
