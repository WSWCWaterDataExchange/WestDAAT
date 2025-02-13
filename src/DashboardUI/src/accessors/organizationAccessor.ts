import { IMsalContext } from '@azure/msal-react';
import { OrganizationDetailsListRequest } from '../data-contracts/OrganizationDetailsListRequest';
import westDaatApi from './westDaatApi';
import { OrganizationDetailsListResponse } from '../data-contracts/OrganizationDetailsListResponse';

export const getAllOrganizations = async (msalContext: IMsalContext): Promise<OrganizationDetailsListResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationDetailsListRequest = {
    $type: 'OrganizationDetailsListRequest',
  };

  const { data } = await api.post('Organizations/Search', request);
  return data;
};
