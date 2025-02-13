import { IMsalContext } from '@azure/msal-react';
import { OrganizationDetailsListRequest } from '../data-contracts/OrganizationDetailsListRequest';
import westDaatApi from './westDaatApi';
import { OrganizationDetailsListResponse } from '../data-contracts/OrganizationDetailsListResponse';
import { OrganizationSummaryListResponse } from '../data-contracts/OrganizationSummaryListResponse';
import { OrganizationSummaryListRequest } from '../data-contracts/OrganizationSummaryListRequest';

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
