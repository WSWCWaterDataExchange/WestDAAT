import { WaterRightsSearchDetail } from "./WaterRightsSearchDetail";

export interface WaterRightsSearchResults {
  currentPageNumber: number;
  hasMoreResults: boolean;
  waterRightsDetails: WaterRightsSearchDetail[];  
}
