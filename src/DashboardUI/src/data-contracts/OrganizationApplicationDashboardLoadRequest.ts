import { ApplicationLoadRequestBase } from './ApplicationLoadRequestBase';

export interface OrganizationApplicationDashboardLoadRequest extends ApplicationLoadRequestBase {
  $type: 'OrganizationApplicationDashboardLoadRequest';
  organizationIdFilter?: string;
}
