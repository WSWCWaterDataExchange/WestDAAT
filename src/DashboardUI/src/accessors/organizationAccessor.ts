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
import { OrganizationMemberRemoveResponse } from '../data-contracts/OrganizationMemberRemoveResponse';
import { OrganizationMemberRemoveRequest } from '../data-contracts/OrganizationMemberRemoveRequest';

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

export const addOrganizationMember = async (
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

export const removeOrganizationMember = async (
  msalContext: IMsalContext,
  organizationId: string,
  userId: string,
): Promise<{ data: OrganizationMemberRemoveResponse; status: number }> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationMemberRemoveRequest = {
    $type: 'OrganizationMemberRemoveRequest',
    organizationId,
    userId,
  }

  const { data, status } = await api.delete<OrganizationMemberRemoveResponse>(
    `Organizations/${organizationId}/Members`,
    { data: request }
  );

  return { data, status };
}
