import {
  RegulationDetails,
  RegulatoryOverlayInfoListItem,
} from "@data-contracts";
import axios from "axios";

// TODO: Wire to API when route is created
export const getRegulationDetails = async (areaUuid: string) => {
  /*const { data } = await axios.get<RegulationDetails>(
                                    `${process.env.REACT_APP_WEBAPI_URL}Regulation/${areaUuid}`,
                                  ); */

  const data = {
    waDEAreaReportingUuid: "C0o_RUCO356",
    reportingAreaNativeId: "CO356",
    waDEReportingAreaName: "WaDE Blank",
    waDEOverlayAreaType: "Administration",
    nativeReportingAreaType: "Groundwater Management District",
    reportingAreaName: "Arikaree",
    reportingAreaState: "CO",
    // areaLastUpdated: new Date("08/05/2005"),
    managingAgencyOrganizationName: "Colorado Division of Water Resources",
    managingAgencyState: "CO",
    managingAgencyWebsite: "https://water.state.co.us/",
  } as RegulationDetails;

  return data;
};

export const getRegulatoryOverlayInfoList = async (areaUuid: string) => {
  const data = [
    {
      waDEOverlayUuid: "C0o_RUCO356",
      overlayNativeId: "WaDE Blank",
      overlayType: "Groundwater Management District",
    },
  ] as RegulatoryOverlayInfoListItem[];

  return data;
};
