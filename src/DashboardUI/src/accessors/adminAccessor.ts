import { IMsalContext } from '@azure/msal-react';
import { OrganizationLoadAllRequest } from '../data-contracts/OrganizationLoadAllRequest';
import westDaatApi from './westDaatApi';

export const getAllOrganizations = async (msalContext: IMsalContext): Promise<string> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationLoadAllRequest = {
    $type: 'OrganizationLoadAllRequest',
  };

  const { data } = await api.post('Organizations/Search', request);
  return data;
};
