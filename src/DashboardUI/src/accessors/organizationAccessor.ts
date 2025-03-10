import { IMsalContext } from '@azure/msal-react';
import { Role } from '../config/role';
import { OrganizationDetailsListRequest } from '../data-contracts/OrganizationDetailsListRequest';
import { OrganizationDetailsListResponse } from '../data-contracts/OrganizationDetailsListResponse';
import { OrganizationFundingDetailsRequest } from '../data-contracts/OrganizationFundingDetailsRequest';
import { OrganizationFundingDetailsResponse } from '../data-contracts/OrganizationFundingDetailsResponse';
import { OrganizationMemberAddRequest } from '../data-contracts/OrganizationMemberAddRequest';
import { OrganizationMemberAddResponse } from '../data-contracts/OrganizationMemberAddResponse';
import { OrganizationMemberRemoveRequest } from '../data-contracts/OrganizationMemberRemoveRequest';
import { OrganizationMemberRemoveResponse } from '../data-contracts/OrganizationMemberRemoveResponse';
import { OrganizationMemberUpdateRequest } from '../data-contracts/OrganizationMemberUpdateRequest';
import { OrganizationMemberUpdateResponse } from '../data-contracts/OrganizationMemberUpdateResponse';
import { OrganizationSummaryListRequest } from '../data-contracts/OrganizationSummaryListRequest';
import { OrganizationSummaryListResponse } from '../data-contracts/OrganizationSummaryListResponse';
import westDaatApi from './westDaatApi';

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
  role: Role,
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

export const editOrganizationMember = async (
  msalContext: IMsalContext,
  organizationId: string,
  userId: string,
  role: Role
): Promise<{ data: OrganizationMemberUpdateResponse, status: number }> => {
  const api = await westDaatApi(msalContext);

  const request: OrganizationMemberUpdateRequest = {
    $type: 'OrganizationMemberUpdateRequest',
    organizationId,
    userId,
    role
  }

  const { data, status } = await api.put<OrganizationMemberUpdateResponse>(
    `Organizations/${organizationId}/Members`,
    request
  );

  return { data, status };
}