export interface PolygonEtDatapoint {
  year: number;
  totalEtInInches: number;
  effectivePrecipitationInInches: number | null;
  netEtInInches: number | null;
}
