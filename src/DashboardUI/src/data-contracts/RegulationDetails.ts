// TODO: Update with finalized attribute names
export interface RegulationDetails {
  // Reporting Area Information
  waDEAreaReportingUuid: string;
  reportingAreaNativeId: string;
  waDEReportingAreaName: string;
  waDEOverlayAreaType: string;
  nativeReportingAreaType: string;
  reportingAreaName: string;
  reportingAreaState: string;
  areaLastUpdated: Date;

  // Managing Agency
  managingAgencyOrganizationName: string;
  managingAgencyState: string;
  managingAgencyWebsite: string;
}
