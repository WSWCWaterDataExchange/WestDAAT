export interface TimeSeriesListItem {
  waDEVariableUuid: string;
  waDEMethodUuid: string;
  waDEWaterSourceUuid: string;
  timeframeStart: Date;
  timeframeEnd: Date;
  reportYear: string;
  amount: number;
  beneficialUse: string;
  populationServed?: number;
  cropDutyAmount?: number;
  communityWaterSupplySystem: string;
}
