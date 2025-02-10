import { IMsalContext } from '@azure/msal-react';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { OrganizationApplicationDashboardLoadRequest } from '../data-contracts/OrganizationApplicationDashboardLoadRequest';
import { OrganizationApplicationDashboardLoadResponse } from '../data-contracts/OrganizationApplicationDashboardLoadResponse';
import westDaatApi from './westDaatApi';

export const applicationSearch = async (
  msalContext: IMsalContext,
  organizationId?: string,
): Promise<OrganizationApplicationDashboardLoadResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationApplicationDashboardLoadRequest = {
    $type: 'OrganizationApplicationDashboardLoadRequest',
    organizationIdFilter: organizationId,
  };

  const { data } = await api.post('Applications/Search', request);

  data.applications.forEach((app: ApplicationDashboardListItem) => {
    return {
      ...app,
      submittedDate: new Date(app.submittedDate),
    };
  });

  return data;
};
