import axios from "axios";
import WaterRightDigest from "../data-contracts/WaterRightsDigest";
import { WaterSiteDetails } from "../data-contracts/WaterSiteDetails";

export const getWaterRightsDigests = async (siteUuid: string): Promise<WaterRightDigest[]> => {
  const url = new URL(`Sites/${siteUuid}/WaterRightsDigest`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<WaterRightDigest[]>(
    url.toString()
  );
  return data;
};

export const getWaterSiteDetails = async (siteUuid: string): Promise<WaterSiteDetails> => {
  const url = new URL(`Sites/${siteUuid}`, process.env.REACT_APP_WEBAPI_URL);
  // const { data } = await axios.get<WaterSiteDetails>(
  //   url.toString()
  // );

  const data: WaterSiteDetails = {
    aggregationInterval: 1,
    aggregationIntervalUnit: "test",
    aggregationStatistic: "test",
    amountUnitCv: "test",
    organizationName: "test name",
    organizationWebsite: "www.google.com",
    reportYearStartMonth: "5",
    reportYearTypeCv: "test",
    state: "NE",
    variableCv: "test",
    variableSpecific: "test, test",
  }
  return data;
};