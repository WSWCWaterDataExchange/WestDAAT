export interface TimeSeriesListItem {
  waDEVariableUuid: string;
  waDEMethodUuid: string;
  waDEWaterSourceUuid: string;
  timeframeStart: Date;
  timeframeEnd: Date;
  reportYear: string;
  amount: number;
  primaryUse: string;
  populationServed?: number;
  cropDutyAmount?: number;
  communityWaterSupplySystem: string;
  associatedNativeAllocationId?: string;
  allocationUuid?: string;
}
