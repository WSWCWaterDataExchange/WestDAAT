import { IMsalContext } from '@azure/msal-react';
import { OrganizationDetailsListRequest } from '../data-contracts/OrganizationDetailsListRequest';
import westDaatApi from './westDaatApi';
import { OrganizationDetailsListResponse } from '../data-contracts/OrganizationDetailsListResponse';
import { OrganizationSummaryListResponse } from '../data-contracts/OrganizationSummaryListResponse';
import { OrganizationSummaryListRequest } from '../data-contracts/OrganizationSummaryListRequest';
import { OrganizationMemberAddRequest } from '../data-contracts/OrganizationMemberAddRequest';
import { OrganizationMemberAddResponse } from '../data-contracts/OrganizationMemberAddResponse';
import { OrganizationFundingDetailsResponse } from '../data-contracts/OrganizationFundingDetailsResponse';
import { OrganizationFundingDetailsRequest } from '../data-contracts/OrganizationFundingDetailsRequest';

export const getOrganizationDetailsList = async (
  msalContext: IMsalContext,
): Promise<OrganizationDetailsListResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationDetailsListRequest = {
    $type: 'OrganizationDetailsListRequest',
  };

  const { data } = await api.post('Organizations/Search', request);
  return data;
};

export const getOrganizationSummaryList = async (
  msalContext: IMsalContext,
): Promise<OrganizationSummaryListResponse> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationSummaryListRequest = {
    $type: 'OrganizationSummaryListRequest',
  };

  const { data } = await api.post('Organizations/Search', request);
  return data;
};

export const getOrganizationFundingDetails = async (
  msalContext: IMsalContext,
  waterRightNativeId: string,
): Promise<OrganizationFundingDetailsResponse> => {
  const request: OrganizationFundingDetailsRequest = {
    $type: 'OrganizationFundingDetailsRequest',
    waterRightNativeId,
  };

  const api = await westDaatApi(msalContext);
  const { data } = await api.post('Organizations/Search', request);
  return data;
};

export const addOrganizationMemeber = async (
  msalContext: IMsalContext,
  organizationId: string,
  userId: string,
  role: string,
): Promise<{ data: OrganizationMemberAddResponse; status: number }> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationMemberAddRequest = {
    $type: 'OrganizationMemberAddRequest',
    userId,
    role,
  };

  const { data, status } = await api.post<OrganizationMemberAddResponse>(
    `Organizations/${organizationId}/Members`,
    request,
  );

  return { data, status };
};
