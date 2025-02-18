import { IMsalContext } from '@azure/msal-react';
import westDaatApi from './westDaatApi';
import { UserSearchRequest } from '../data-contracts/UserSearchRequest';
import { UserSearchResponse } from '../data-contracts/UserSearchResponse';

export const searchUsers = async (msalContext: IMsalContext, searchTerm: string): Promise<UserSearchResponse> => {
  const api = await westDaatApi(msalContext);

  const request: UserSearchRequest = {
    $type: 'UserSearchRequest',
    searchTerm,
  };

  const { data } = await api.post('Users/Search', request);
  return data;
};
