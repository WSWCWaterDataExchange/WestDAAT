import { ApplicationDashboardListItem } from './ApplicationDashboardListItem';
import { ApplicationLoadResponseBase } from './ApplicationLoadResponseBase';

export interface OrganizationApplicationDashboardLoadResponse extends ApplicationLoadResponseBase {
  applications: ApplicationDashboardListItem[];
}
