import { produce } from 'immer';
import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { PolygonEtDataCollection } from '../data-contracts/PolygonEtDataCollection';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { EstimationFormMapPolygon } from '../data-contracts/EstimationFormMapPolygon';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  conservationApplication: {
    waterRightNativeId: string | undefined;
    waterConservationApplicationId: string | undefined;
    fundingOrganizationId: string | undefined;
    fundingOrganizationName: string | undefined;
    openEtModelName: string | undefined;
    dateRangeStart: Date | undefined;
    dateRangeEnd: Date | undefined;
    compensationRateModel: string | undefined;
    desiredCompensationDollars: number | undefined;
    desiredCompensationUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
    totalAverageYearlyEtAcreFeet: number | undefined;
    conservationPayment: number | undefined;
    selectedMapPolygons: EstimationFormMapPolygon[];
    polygonEtData: PolygonEtDataCollection[];
  };
  canEstimateConsumptiveUse: boolean;
  canContinueToApplication: boolean;
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  conservationApplication: {
    waterRightNativeId: undefined,
    waterConservationApplicationId: undefined,
    fundingOrganizationId: undefined,
    fundingOrganizationName: undefined,
    openEtModelName: undefined,
    dateRangeStart: undefined,
    dateRangeEnd: undefined,
    compensationRateModel: undefined,
    desiredCompensationDollars: undefined,
    desiredCompensationUnits: undefined,
    totalAverageYearlyEtAcreFeet: undefined,
    conservationPayment: undefined,
    selectedMapPolygons: [],
    polygonEtData: [],
  },
  canEstimateConsumptiveUse: false,
  canContinueToApplication: false,
});

export type ApplicationAction =
  | DashboardApplicationsLoadedAction
  | EstimationToolPageLoadedAction
  | FundingOrganizationLoadedAction
  | MapSelectedPolygonsUpdatedAction
  | EstimationFormUpdatedAction
  | WaterConservationApplicationCreatedAction
  | EstimateConsumptiveUseLoadedAction;

export interface DashboardApplicationsLoadedAction {
  type: 'DASHBOARD_APPLICATIONS_LOADED';
  payload: {
    dashboardApplications: ApplicationDashboardListItem[];
  };
}

export interface EstimationToolPageLoadedAction {
  type: 'ESTIMATION_TOOL_PAGE_LOADED';
  payload: {
    waterRightNativeId: string;
  };
}

export interface FundingOrganizationLoadedAction {
  type: 'FUNDING_ORGANIZATION_LOADED';
  payload: {
    fundingOrganizationId: string;
    fundingOrganizationName: string;
    openEtModelName: string;
    dateRangeStart: Date;
    dateRangeEnd: Date;
    compensationRateModel: string;
  };
}

export interface MapSelectedPolygonsUpdatedAction {
  type: 'MAP_SELECTED_POLYGONS_UPDATED';
  payload: {
    polygons: EstimationFormMapPolygon[];
  };
}

export interface EstimationFormUpdatedAction {
  type: 'ESTIMATION_FORM_UPDATED';
  payload: {
    desiredCompensationDollars: number | undefined;
    desiredCompensationUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
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
    case 'ESTIMATION_TOOL_PAGE_LOADED':
      return onEstimationToolPageLoaded(draftState, action);
    case 'FUNDING_ORGANIZATION_LOADED':
      return onFundingOrganizationLoaded(draftState, action);
    case 'APPLICATION_CREATED':
      return onWaterConservationApplicationCreated(draftState, action);
    case 'MAP_SELECTED_POLYGONS_UPDATED':
      return onMapSelectedPolygonsUpdated(draftState, action);
    case 'ESTIMATION_FORM_UPDATED':
      return onEstimationFormUpdated(draftState, action);
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

const onEstimationToolPageLoaded = (
  draftState: ConservationApplicationState,
  { payload }: EstimationToolPageLoadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterRightNativeId = payload.waterRightNativeId;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onFundingOrganizationLoaded = (
  draftState: ConservationApplicationState,
  { payload }: FundingOrganizationLoadedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.fundingOrganizationId = payload.fundingOrganizationId;
  application.fundingOrganizationName = payload.fundingOrganizationName;
  application.openEtModelName = payload.openEtModelName;
  application.dateRangeStart = payload.dateRangeStart;
  application.dateRangeEnd = payload.dateRangeEnd;
  application.compensationRateModel = payload.compensationRateModel;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onWaterConservationApplicationCreated = (
  draftState: ConservationApplicationState,
  { payload }: WaterConservationApplicationCreatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterConservationApplicationId = payload.waterConservationApplicationId;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onMapSelectedPolygonsUpdated = (
  draftState: ConservationApplicationState,
  { payload }: MapSelectedPolygonsUpdatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.selectedMapPolygons = payload.polygons;

  resetConsumptiveUseEstimation(draftState);
  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onEstimationFormUpdated = (
  draftState: ConservationApplicationState,
  { payload }: EstimationFormUpdatedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.desiredCompensationDollars = payload.desiredCompensationDollars;
  application.desiredCompensationUnits = payload.desiredCompensationUnits;

  resetConsumptiveUseEstimation(draftState);
  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onEstimateConsumptiveUseLoaded = (
  draftState: ConservationApplicationState,
  { payload }: EstimateConsumptiveUseLoadedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.totalAverageYearlyEtAcreFeet = payload.totalAverageYearlyEtAcreFeet;
  application.conservationPayment = payload.conservationPayment;
  application.polygonEtData = payload.dataCollections;

  checkCanContinueToApplication(draftState);

  return draftState;
};

const checkCanEstimateConsumptiveUse = (draftState: ConservationApplicationState): void => {
  const app = draftState.conservationApplication;

  draftState.canEstimateConsumptiveUse =
    !!app.waterConservationApplicationId &&
    !!app.waterRightNativeId &&
    !!app.openEtModelName &&
    !!app.dateRangeStart &&
    !!app.dateRangeEnd &&
    !!app.selectedMapPolygons &&
    app.selectedMapPolygons.length > 0 &&
    app.selectedMapPolygons.every((p) => p.acreage <= 50000);

  return;
};

const checkCanContinueToApplication = (draftState: ConservationApplicationState): void => {
  const app = draftState.conservationApplication;

  draftState.canContinueToApplication =
    !!app.waterConservationApplicationId &&
    !!app.fundingOrganizationId &&
    !!app.waterRightNativeId &&
    !!app.openEtModelName &&
    !!app.dateRangeStart &&
    !!app.dateRangeEnd &&
    !!app.desiredCompensationDollars &&
    !!app.desiredCompensationUnits &&
    !!app.totalAverageYearlyEtAcreFeet &&
    !!app.conservationPayment &&
    !!app.selectedMapPolygons &&
    app.selectedMapPolygons.length > 0 &&
    app.selectedMapPolygons.every((p) => p.acreage <= 50000);

  return;
};

const resetConsumptiveUseEstimation = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.totalAverageYearlyEtAcreFeet = undefined;
  draftState.conservationApplication.conservationPayment = undefined;
  draftState.conservationApplication.polygonEtData = [];
  draftState.canContinueToApplication = false;
};
