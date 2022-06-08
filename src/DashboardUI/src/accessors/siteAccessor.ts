import { WaterSourceInfoListItem } from "@data-contracts";
import axios from "axios";
import { SiteDetails } from "../data-contracts/SiteDetails";
import { WaterRightInfoListItem } from "../data-contracts/WaterRightInfoListItem";
import WaterRightDigest from "../data-contracts/WaterRightsDigest";

export const getWaterRightsDigests = async (siteUuid: string): Promise<WaterRightDigest[]> => {
  const url = new URL(`Sites/${siteUuid}/WaterRightsDigest`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<WaterRightDigest[]>(
    url.toString()
  );
  return data;
};

export const getWaterSiteLocation = async (siteUuid: string) => {
  const url = new URL(`Sites/${siteUuid}/SiteLocation`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<
    GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  >(
    url.toString()
  );
  return data;
};

export const getWaterSiteSourceInfoList = async (siteUuid: string) => {
  const url = new URL(`Sites/${siteUuid}/Sources`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<WaterSourceInfoListItem[]>(
    url.toString()
  );
  return data;
};

export const getWaterRightInfoList = async (siteUuid: string) => {
  const url = new URL(`Sites/${siteUuid}/Rights`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<WaterRightInfoListItem[]>(
    url.toString()
  );
  return data;
};

export const getSiteDetails = async (siteUuid: string) => {
  const url = new URL(`Sites/${siteUuid}`, process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<SiteDetails>(
    url.toString()
  );
  return data;
};