import { IMsalContext } from '@azure/msal-react';
import { OrganizationUserListRequest } from '../data-contracts/OrganizationUserListRequest';
import { UserListResponse } from '../data-contracts/UserListResponse';
import { UserSearchRequest } from '../data-contracts/UserSearchRequest';
import { UserSearchResponse } from '../data-contracts/UserSearchResponse';
import westDaatApi from './westDaatApi';

export const searchUsers = async (msalContext: IMsalContext, searchTerm: string): Promise<UserSearchResponse> => {
  const api = await westDaatApi(msalContext);

  const request: UserSearchRequest = {
    $type: 'UserSearchRequest',
    searchTerm,
  };

  const { data } = await api.post('Users/Search', request);
  return data;
};

export const getOrganizationUsers = async (msalContext: IMsalContext, organizationId: string): Promise<UserListResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationUserListRequest = {
    $type: 'OrganizationUserListRequest',
    organizationId,
  }

  const { data } = await api.post('Users/Search', request);
  return data;
}