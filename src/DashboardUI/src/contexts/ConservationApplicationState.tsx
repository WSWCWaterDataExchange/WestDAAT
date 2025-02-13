import { produce } from 'immer';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { FundingOrganizationDetails } from '../data-contracts/FundingOrganizationDetails';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  conservationApplication: {
    fundingOrganization: FundingOrganizationDetails | undefined;
  };
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  conservationApplication: {
    fundingOrganization: undefined,
  },
});

export type ApplicationAction = DashboardApplicationsLoadedAction | FundingOrganizationLoadedAction;

export interface DashboardApplicationsLoadedAction {
  type: 'DASHBOARD_APPLICATIONS_LOADED';
  payload: {
    dashboardApplications: ApplicationDashboardListItem[];
  };
}

export interface FundingOrganizationLoadedAction {
  type: 'FUNDING_ORGANIZATION_LOADED';
  payload: {
    fundingOrganization: FundingOrganizationDetails;
  };
}

export const reducer = (
  state: ConservationApplicationState,
  action: ApplicationAction,
): ConservationApplicationState => {
  // Wrap reducer in immer's produce function so we can
  // mutate the draft state without mutating the original state.
  return produce(state, (draftState) => {
    return reduce(draftState, action);
  });
};

// Given an action and the current state, return the new state
const reduce = (draftState: ConservationApplicationState, action: ApplicationAction): ConservationApplicationState => {
  switch (action.type) {
    case 'DASHBOARD_APPLICATIONS_LOADED':
      return onDashboardApplicationsLoaded(draftState, action);
    case 'FUNDING_ORGANIZATION_LOADED':
      return onFundingOrganizationLoaded(draftState, action);
  }
};

const onDashboardApplicationsLoaded = (
  draftState: ConservationApplicationState,
  action: DashboardApplicationsLoadedAction,
): ConservationApplicationState => {
  draftState.dashboardApplications = action.payload.dashboardApplications;
  return draftState;
};

const onFundingOrganizationLoaded = (
  draftState: ConservationApplicationState,
  action: FundingOrganizationLoadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.fundingOrganization = action.payload.fundingOrganization;
  return draftState;
};
