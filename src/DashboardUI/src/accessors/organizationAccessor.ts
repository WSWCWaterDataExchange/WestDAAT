import { IMsalContext } from '@azure/msal-react';
import { OrganizationLoadAllRequest } from '../data-contracts/OrganizationLoadAllRequest';
import westDaatApi from './westDaatApi';
import { OrganizationLoadAllResponse } from '../data-contracts/OrganizationLoadAllResponse';

export const getAllOrganizations = async (msalContext: IMsalContext): Promise<OrganizationLoadAllResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationLoadAllRequest = {
    $type: 'OrganizationLoadAllRequest',
  };

  throw new Error('Not implemented');
  const { data } = await api.post('Organizations/Search', request);
  return data;
};
