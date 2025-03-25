import { createContext, useContext } from 'react';
import { UseQueryResult } from 'react-query';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useParams } from 'react-router-dom';
import { ApplicationDetails } from '../../../data-contracts/ApplicationDetails';
import { ApplicationReviewNote } from '../../../data-contracts/ApplicationReviewNote';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { OrganizationFundingDetailsResponse } from '../../../data-contracts/OrganizationFundingDetailsResponse';

type Query<T> = Pick<UseQueryResult<T>, 'data' | 'isError' | 'isLoading'>;
const defaultQuery = { data: undefined, isError: false, isLoading: false };

interface ApplicationReviewPageContextState {
  getApplicationQuery: Query<{ application: ApplicationDetails; notes?: ApplicationReviewNote[] }>;
  getFundingOrganizationQuery: Query<OrganizationFundingDetailsResponse>;
}

const defaultState: ApplicationReviewPageContextState = {
  getApplicationQuery: defaultQuery,
  getFundingOrganizationQuery: defaultQuery,
};

const ApplicationReviewPageContext = createContext<ApplicationReviewPageContextState>(defaultState);
export const useApplicationReviewPageContext = () => useContext(ApplicationReviewPageContext);

interface ApplicationReviewPageProviderProps {
  children: React.ReactNode;
}
export const ApplicationReviewPageProvider = ({ children }: ApplicationReviewPageProviderProps) => {
  const { applicationId } = useParams();
  const { state: conservationApplicationState } = useConservationApplicationContext();

  const getApplicationQuery = useGetApplicationQuery(applicationId, 'reviewer', true);
  const getFundingOrganizationQuery = useFundingOrganizationQuery(
    conservationApplicationState.conservationApplication.waterRightNativeId,
  );

  const state: ApplicationReviewPageContextState = {
    getApplicationQuery,
    getFundingOrganizationQuery,
  };

  return <ApplicationReviewPageContext.Provider value={state}>{children}</ApplicationReviewPageContext.Provider>;
};
