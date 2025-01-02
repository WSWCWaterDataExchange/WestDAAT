export interface OverlayTableEntry {
  allocationUuid: string;
  waterRightNativeId: string;
  owner: string;
  priorityDate: string;
  expirationDate?: string | null;
  legalStatus: string;
  flow: number;
  volume: number;
  beneficialUses: string[];
}
