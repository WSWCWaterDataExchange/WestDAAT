import { produce } from 'immer';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { EstimateConsumptiveUseResponse } from '../data-contracts/EstimateConsumptiveUseResponse';
import { PolygonEtDataCollection } from '../data-contracts/PolygonEtDataCollection';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  conservationApplication: {
    waterRightNativeId: string | undefined;
    waterConservationApplicationId: string | undefined;
    fundingOrganizationId: string | undefined;
    fundingOrganizationName: string | undefined;
    openEtModel: string | undefined;
    dateRangeStart: Date | undefined;
    dateRangeEnd: Date | undefined;
    compensationRateModel: string | undefined;
    totalAverageYearlyEtAcreFeet: number | undefined;
    conservationPayment: number | undefined;
    dataCollections: PolygonEtDataCollection[] | undefined;
  };
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  conservationApplication: {
    waterRightNativeId: undefined,
    waterConservationApplicationId: undefined,
    fundingOrganizationId: undefined,
    fundingOrganizationName: undefined,
    openEtModel: undefined,
    dateRangeStart: undefined,
    dateRangeEnd: undefined,
    compensationRateModel: undefined,
    totalAverageYearlyEtAcreFeet: undefined,
    conservationPayment: undefined,
    dataCollections: undefined,
  },
});

export type ApplicationAction =
  | DashboardApplicationsLoadedAction
  | WaterRightLoadedAction
  | FundingOrganizationLoadedAction
  | WaterConservationApplicationCreatedAction
  | EstimateConsumptiveUseLoadedAction;

export interface DashboardApplicationsLoadedAction {
  type: 'DASHBOARD_APPLICATIONS_LOADED';
  payload: {
    dashboardApplications: ApplicationDashboardListItem[];
  };
}

export interface WaterRightLoadedAction {
  type: 'WATER_RIGHT_LOADED';
  payload: {
    waterRightNativeId: string;
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
    waterConservationApplicationId: string;
  };
}

export interface EstimateConsumptiveUseLoadedAction {
  type: 'ESTIMATE_CONSUMPTIVE_USE_LOADED';
  payload: {
    totalAverageYearlyEtAcreFeet: number;
    conservationPayment: number | undefined;
    dataCollections: PolygonEtDataCollection[];
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
    case 'WATER_RIGHT_LOADED':
      return onWaterRightLoaded(draftState, action);
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

const onWaterRightLoaded = (
  draftState: ConservationApplicationState,
  { payload }: WaterRightLoadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterRightNativeId = payload.waterRightNativeId;
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
  { payload }: WaterConservationApplicationCreatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterConservationApplicationId = payload.waterConservationApplicationId;
  return draftState;
};

const onEstimateConsumptiveUseLoaded = (
  draftState: ConservationApplicationState,
  { payload }: EstimateConsumptiveUseLoadedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.totalAverageYearlyEtAcreFeet = payload.totalAverageYearlyEtAcreFeet;
  application.conservationPayment = payload.conservationPayment;
  application.dataCollections = payload.dataCollections;
  return draftState;
};
