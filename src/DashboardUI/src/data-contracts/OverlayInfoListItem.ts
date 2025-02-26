export interface OverlayInfoListItem {
  waDEOverlayUuid: string;
  overlayNativeID: string;
  overlayName: string;
  overlayType: string;
  waterSourceType: string;
  overlayStatus: string;
  overlayStatute?: string | null;
  statuteLink: string;
  statutoryEffectiveDate: string;
  statutoryEndDate?: string | null;
  overlayStatusDesc: string;
}
