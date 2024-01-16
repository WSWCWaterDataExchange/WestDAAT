import { SiteSpecificSearchDetail } from "./SiteSpecificSearchDetail";

export interface SiteSpecificSearchResults {
  currentPageNumber: number;
  hasMoreResults: boolean;
  siteSpecificDetails: SiteSpecificSearchDetail[];  
}


