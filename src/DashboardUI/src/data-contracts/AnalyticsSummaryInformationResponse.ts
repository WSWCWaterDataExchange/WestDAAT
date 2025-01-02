import { AnalyticsSummaryInformation } from './AnalyticsSummaryInformation';
import { GroupItem } from './GroupItem';

export interface AnalyticsSummaryInformationResponse {
  analyticsSummaryInformation: AnalyticsSummaryInformation[];
  groupItems: GroupItem[];
  groupValue: number;
}
