import WaterRightDigest from './WaterRightsDigest';

interface SiteDigest {
  siteUuid: string;
  siteNativeId: string;
  siteType: string;
  siteName: string;
  hasTimeSeriesData: boolean;
  waterRightsDigests: WaterRightDigest[];
}

export default SiteDigest;
