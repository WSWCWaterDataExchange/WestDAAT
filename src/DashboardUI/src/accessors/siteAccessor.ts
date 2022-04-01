import axios from "axios";
import WaterRightDigest from "../data-contracts/WaterRightsDigest";

export const getWaterRightsDigests = async (siteUuid: string): Promise<WaterRightDigest[]> => {
  const url = new URL(`Sites/${siteUuid}/WaterRightsDigest`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<WaterRightDigest[]>(
    url.toString()
  );
  return data;
};