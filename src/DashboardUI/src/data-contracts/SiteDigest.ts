import WaterRightDigest from './WaterRightsDigest';

interface SiteDigest {
  siteUuid: string;
  siteNativeId: string;
  siteType: string;
  siteName: string;
  hasTimeSeriesData: boolean;
  timeSeriesVariableTypes: string[];
  waterRightsDigests: WaterRightDigest[];
}

export default SiteDigest;
