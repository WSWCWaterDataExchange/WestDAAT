export enum RasterTimeSeriesModel {
  None = 0,
  SSEBop = 1,
}

export const RasterTimeSeriesModelLabels: Record<RasterTimeSeriesModel, string> = {
  [RasterTimeSeriesModel.None]: 'None',
  [RasterTimeSeriesModel.SSEBop]: 'SSEBop',
};
