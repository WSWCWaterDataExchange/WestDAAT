import { produce } from 'immer';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  dashboardApplicationsStatistics: {
    submittedApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    inReviewApplications: number;
    cumulativeEstimatedSavingsAcreFeet: number;
    totalObligationDollars: number;
  };
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  dashboardApplicationsStatistics: {
    submittedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    inReviewApplications: 0,
    cumulativeEstimatedSavingsAcreFeet: 0,
    totalObligationDollars: 0,
  },
});

export type ApplicationAction = DashboardApplicationsLoadedAction | DashboardApplicationsFilteredAction;

export interface DashboardApplicationsLoadedAction {
  type: 'DASHBOARD_APPLICATIONS_LOADED';
  payload: {
    dashboardApplications: ApplicationDashboardListItem[];
  };
}

export interface DashboardApplicationsFilteredAction {
  type: 'DASHBOARD_APPLICATION_FILTERS_CHANGED';
  payload: {
    applicationIds: string[];
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
    case 'DASHBOARD_APPLICATION_FILTERS_CHANGED':
      return onDashboardApplicationsFiltered(draftState, action);
  }
};

const onDashboardApplicationsLoaded = (
  draftState: ConservationApplicationState,
  action: DashboardApplicationsLoadedAction,
): ConservationApplicationState => {
  draftState.dashboardApplications = action.payload.dashboardApplications;
  return draftState;
};

const onDashboardApplicationsFiltered = (
  draftState: ConservationApplicationState,
  action: DashboardApplicationsFilteredAction,
): ConservationApplicationState => {
  const filteredApps = action.payload.applicationIds.map((appId) =>
    draftState.dashboardApplications.find((app) => app.applicationId === appId),
  );

  const submittedApps = filteredApps.length;
  const approvedApps = filteredApps.filter((app) => app?.status === ConservationApplicationStatus.Approved).length;
  const inReviewApps = filteredApps.filter((app) => app?.status === ConservationApplicationStatus.InReview).length;
  const rejectedApps = filteredApps.filter((app) => app?.status === ConservationApplicationStatus.Rejected).length;
  const waterSavings = filteredApps
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .filter((app) => app?.compensationRateUnits === CompensationRateUnits.AcreFeet)
    .reduce((sum, app) => sum + (app?.totalWaterVolumeSavingsAcreFeet ?? 0), 0);
  const totalObligation = filteredApps
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .reduce((sum, app) => sum + (app?.totalObligationDollars ?? 0), 0);

  draftState.dashboardApplicationsStatistics = {
    submittedApplications: submittedApps,
    acceptedApplications: approvedApps,
    rejectedApplications: rejectedApps,
    inReviewApplications: inReviewApps,
    cumulativeEstimatedSavingsAcreFeet: waterSavings,
    totalObligationDollars: totalObligation,
  };

  console.log('application dashboard filter reducer');
  return draftState;
};
