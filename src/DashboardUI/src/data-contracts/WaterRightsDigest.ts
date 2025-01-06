interface WaterRightDigest {
  allocationUuid: string;
  nativeId: string;
  priorityDate: Date;
  beneficialUses: string[];
  hasTimeSeriesData: boolean;
}

export default WaterRightDigest;
