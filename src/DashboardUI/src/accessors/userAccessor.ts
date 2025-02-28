import { IMsalContext } from '@azure/msal-react';
import { OrganizationUserListRequest } from '../data-contracts/OrganizationUserListRequest';
import { UserListResponse } from '../data-contracts/UserListResponse';
import { UserSearchRequest } from '../data-contracts/UserSearchRequest';
import { UserSearchResponse } from '../data-contracts/UserSearchResponse';
import westDaatApi from './westDaatApi';
import { UserProfileResponse } from '../data-contracts/UserProfileResponse';
import { UserProfileRequest } from '../data-contracts/UserProfileRequest';

export const searchUsers = async (msalContext: IMsalContext, searchTerm: string): Promise<UserSearchResponse> => {
  const api = await westDaatApi(msalContext);

  const request: UserSearchRequest = {
    $type: 'UserSearchRequest',
    searchTerm,
  };

  const { data } = await api.post('Users/Search', request);
  return data;
};

export const getOrganizationUsers = async (
  msalContext: IMsalContext,
  organizationId: string,
): Promise<UserListResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationUserListRequest = {
    $type: 'OrganizationUserListRequest',
    organizationId,
  };

  const { data } = await api.post('Users/Search', request);
  return data;
};

export const getUserProfile = async (msalContext: IMsalContext, userId: string): Promise<UserProfileResponse> => {
  const api = await westDaatApi(msalContext);

  const request: UserProfileRequest = {
    $type: 'UserProfileRequest',
    userId,
  };

  const { data } = await api.post('Users/Profile', request);
  return data;
};

export const saveProfileInformation = async (msalContext: IMsalContext): Promise<void> => {
  const api = await westDaatApi(msalContext);

  // Simulate a save operation
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
};
