import { AnalyticsSummaryInformation } from './AnalyticsSummaryInformation';
import { GroupItem } from './GroupItem';

export interface AnalyticsSummaryInformationResponse {
  analyticsSummaryInformation: AnalyticsSummaryInformation[];
  dropdownOptions: GroupItem[];
  selectedValue: number;
}
