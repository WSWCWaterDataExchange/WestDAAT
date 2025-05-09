import { FeatureCollection } from 'geojson';

export interface OverlayDetails {
  waDEAreaReportingUuid: string;
  reportingAreaNativeID: string;
  waDEOverlayAreaType: string[];
  nativeReportingAreaType: string;
  state: string;
  areaLastUpdatedDate: string;
  organizationName: string;
  organizationState: string;
  organizationWebsite: string;
  geometry: FeatureCollection | null;
}
