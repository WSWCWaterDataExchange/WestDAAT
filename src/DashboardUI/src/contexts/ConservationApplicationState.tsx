import { produce } from 'immer';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { WaterConservationApplicationCreateResponse } from '../data-contracts/WaterConservationApplicationCreateResponse';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  conservationApplication: {
    waterRightNativeId: string | undefined;
    fundingOrganizationId: string | undefined;
    fundingOrganizationName: string | undefined;
    openEtModel: string | undefined;
    dateRangeStart: Date | undefined;
    dateRangeEnd: Date | undefined;
    compensationRateModel: string | undefined;
    application: WaterConservationApplicationCreateResponse | undefined;
    consumptiveUse: EstimateConsumptiveUseResponse | undefined;
  };
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  conservationApplication: {
    waterRightNativeId: undefined,
    fundingOrganizationId: undefined,
    fundingOrganizationName: undefined,
    openEtModel: undefined,
    dateRangeStart: undefined,
    dateRangeEnd: undefined,
    compensationRateModel: undefined,
    application: undefined,
    consumptiveUse: undefined,
  },
});

export type ApplicationAction =
  | DashboardApplicationsLoadedAction
  | FundingOrganizationLoadedAction
  | WaterConservationApplicationCreatedAction
  | EstimateConsumptiveUseLoadedAction;

export interface DashboardApplicationsLoadedAction {
  type: 'DASHBOARD_APPLICATIONS_LOADED';
  payload: {
    dashboardApplications: ApplicationDashboardListItem[];
  };
}

export interface FundingOrganizationLoadedAction {
  type: 'FUNDING_ORGANIZATION_LOADED';
  payload: {
    fundingOrganizationId: string;
    fundingOrganizationName: string;
    openEtModel: string;
    dateRangeStart: Date;
    dateRangeEnd: Date;
    compensationRateModel: string;
  };
}

export interface WaterConservationApplicationCreatedAction {
  type: 'APPLICATION_CREATED';
  payload: {
    application: WaterConservationApplicationCreateResponse;
  };
}

export interface EstimateConsumptiveUseLoadedAction {
  type: 'ESTIMATE_CONSUMPTIVE_USE_LOADED';
  payload: {
    consumptiveUse: EstimateConsumptiveUseResponse;
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
    case 'APPLICATION_CREATED':
      return onWaterConservationApplicationCreated(draftState, action);
    case 'ESTIMATE_CONSUMPTIVE_USE_LOADED':
      return onEstimateConsumptiveUseLoaded(draftState, action);
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
  { payload }: FundingOrganizationLoadedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.fundingOrganizationId = payload.fundingOrganizationId;
  application.fundingOrganizationName = payload.fundingOrganizationName;
  application.openEtModel = payload.openEtModel;
  application.dateRangeStart = payload.dateRangeStart;
  application.dateRangeEnd = payload.dateRangeEnd;
  application.compensationRateModel = payload.compensationRateModel;
  return draftState;
};

const onWaterConservationApplicationCreated = (
  draftState: ConservationApplicationState,
  action: WaterConservationApplicationCreatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.application = action.payload.application;
  return draftState;
};

const onEstimateConsumptiveUseLoaded = (
  draftState: ConservationApplicationState,
  action: EstimateConsumptiveUseLoadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.consumptiveUse = action.payload.consumptiveUse;
  return draftState;
};
