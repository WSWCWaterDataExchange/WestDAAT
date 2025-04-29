import { GeometryEtDatapoint } from './GeometryEtDatapoint';

type FullPointData = {
  waterConservationApplicationEstimateControlLocationId: string;
  pointWkt: string;
  averageYearlyTotalEtInInches: number;
  datapoints: GeometryEtDatapoint[];
};

export type PartialPointData = Partial<FullPointData>;

export type MapSelectionPointData = Pick<FullPointData, 'pointWkt'>;
