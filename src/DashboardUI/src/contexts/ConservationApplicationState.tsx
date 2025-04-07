import { produce } from 'immer';
import {
  ApplicationDashboardListItem,
  ApplicationDashboardStatistics,
} from '../data-contracts/ApplicationDashboardListItem';
import { PolygonEtDataCollection } from '../data-contracts/PolygonEtDataCollection';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import {
  ApplicationSubmissionFormData,
  defaultApplicationSubmissionFormData,
} from '../data-contracts/ApplicationSubmissionFormData';
import { truncate } from '@turf/truncate';
import center from '@turf/center';
import { convertWktToGeometry } from '../utilities/geometryWktConverter';
import { ApplicationDocument } from '../data-contracts/ApplicationDocuments';
import { MapSelectionPolygonData, PartialPolygonData } from '../data-contracts/CombinedPolygonData';
import { ApplicationDetails } from '../data-contracts/ApplicationDetails';
import { ApplicationReviewNote } from '../data-contracts/ApplicationReviewNote';
import { PointEtDataCollection } from '../data-contracts/PointEtDataCollection';
import { MapSelectionPointData, PartialPointData } from '../data-contracts/CombinedPointData';

export interface ConservationApplicationState {
  dashboardApplications: ApplicationDashboardListItem[];
  dashboardApplicationsStatistics: ApplicationDashboardStatistics;
  conservationApplication: {
    waterRightNativeId: string | undefined;
    waterConservationApplicationId: string | undefined;
    waterConservationApplicationDisplayId: string | undefined;
    fundingOrganizationId: string | undefined;
    fundingOrganizationName: string | undefined;
    openEtModelName: string | undefined;
    dateRangeStart: Date | undefined;
    dateRangeEnd: Date | undefined;
    compensationRateModel: string | undefined;
    desiredCompensationDollars: number | undefined;
    desiredCompensationUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
    cumulativeTotalEtInAcreFeet: number | undefined;
    cumulativeNetEtInAcreFeet: number | undefined;
    conservationPayment: number | undefined;
    applicationSubmissionForm: ApplicationSubmissionFormData;
    estimateLocations: PartialPolygonData[];
    controlLocation: PartialPointData | undefined;
    doPolygonsOverlap: boolean;
    doesControlLocationOverlapWithPolygons: boolean;
    // derived/computed state
    isApplicationSubmissionFormValid: boolean;
    polygonAcreageSum: number;
    supportingDocuments: ApplicationDocument[];
    reviewerNotes: ApplicationReviewNote[];
  };
  isCreatingApplication: boolean;
  isUploadingDocument: boolean;
  isLoadingApplication: boolean;
  loadApplicationErrored: boolean;
  isLoadingFundingOrganization: boolean;
  loadFundingOrganizationErrored: boolean;
  canEstimateConsumptiveUse: boolean;
  canContinueToApplication: boolean;
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  dashboardApplicationsStatistics: {
    submittedApplications: null,
    acceptedApplications: null,
    rejectedApplications: null,
    inReviewApplications: null,
    cumulativeEstimatedSavingsAcreFeet: null,
    totalObligationDollars: null,
  },
  conservationApplication: {
    waterRightNativeId: undefined,
    waterConservationApplicationId: undefined,
    waterConservationApplicationDisplayId: undefined,
    fundingOrganizationId: undefined,
    fundingOrganizationName: undefined,
    openEtModelName: undefined,
    dateRangeStart: undefined,
    dateRangeEnd: undefined,
    compensationRateModel: undefined,
    desiredCompensationDollars: undefined,
    desiredCompensationUnits: undefined,
    cumulativeTotalEtInAcreFeet: undefined,
    cumulativeNetEtInAcreFeet: undefined,
    conservationPayment: undefined,
    applicationSubmissionForm: defaultApplicationSubmissionFormData(),
    estimateLocations: [],
    controlLocation: undefined,
    doPolygonsOverlap: false,
    doesControlLocationOverlapWithPolygons: false,
    isApplicationSubmissionFormValid: false,
    polygonAcreageSum: 0,
    supportingDocuments: [],
    reviewerNotes: [],
  },
  isCreatingApplication: false,
  isUploadingDocument: false,
  isLoadingApplication: false,
  loadApplicationErrored: false,
  isLoadingFundingOrganization: false,
  loadFundingOrganizationErrored: false,
  canEstimateConsumptiveUse: false,
  canContinueToApplication: false,
});

export type ApplicationAction =
  | DashboardApplicationsLoadedAction
  | DashboardApplicationsFilteredAction
  | EstimationToolPageLoadedAction
  | FundingOrganizationLoadingAction
  | FundingOrganizationLoadedAction
  | FundingOrganizationLoadErrored
  | MapPolygonsUpdatedAction
  | EstimationFormUpdatedAction
  | ApplicationCreatedAction
  | ApplicantConsumptiveUseEstimatedAction
  | ReviewerConsumptiveUseEstimateAdjustedAction
  | ApplicationSubmissionFormUpdatedAction
  | ApplicationDocumentUpdatedAction
  | ApplicationDocumentUploadingAction
  | ApplicationDocumentUploadedAction
  | ApplicationDocumentRemovedAction
  | ApplicationLoadingAction
  | ApplicationLoadedAction
  | ApplicationLoadErroredAction;

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

export interface EstimationToolPageLoadedAction {
  type: 'ESTIMATION_TOOL_PAGE_LOADED';
  payload: {
    waterRightNativeId: string;
  };
}

export interface FundingOrganizationLoadingAction {
  type: 'FUNDING_ORGANIZATION_LOADING';
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

export interface FundingOrganizationLoadErrored {
  type: 'FUNDING_ORGANIZATION_LOAD_ERRORED';
}

export interface MapPolygonsUpdatedAction {
  type: 'MAP_POLYGONS_UPDATED';
  payload: {
    polygons: MapSelectionPolygonData[];
    doPolygonsOverlap: boolean;
    controlLocation?: MapSelectionPointData;
    doesControlLocationOverlapWithPolygons?: boolean;
  };
}

export interface EstimationFormUpdatedAction {
  type: 'ESTIMATION_FORM_UPDATED';
  payload: {
    desiredCompensationDollars: number | undefined;
    desiredCompensationUnits: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  };
}

export interface ApplicationCreatedAction {
  type: 'APPLICATION_CREATED';
  payload: {
    waterConservationApplicationId: string;
    waterConservationApplicationDisplayId: string;
  };
}

export interface ApplicantConsumptiveUseEstimatedAction {
  type: 'CONSUMPTIVE_USE_ESTIMATED';
  payload: {
    cumulativeTotalEtInAcreFeet: number;
    conservationPayment: number | undefined;
    dataCollections: PolygonEtDataCollection[];
  };
}

export interface ReviewerConsumptiveUseEstimateAdjustedAction {
  type: 'CONSUMPTIVE_USE_ADJUSTED';
  payload: {
    cumulativeTotalEtInAcreFeet: number;
    cumulativeNetEtInAcreFeet: number;
    conservationPayment: number | undefined;
    dataCollections: PolygonEtDataCollection[];
    controlDataCollection: PointEtDataCollection;
  };
}

export interface ApplicationSubmissionFormUpdatedAction {
  type: 'APPLICATION_SUBMISSION_FORM_UPDATED';
  payload: {
    formValues: ApplicationSubmissionFormData;
  };
}

export interface ApplicationDocumentUpdatedAction {
  type: 'APPLICATION_DOCUMENT_UPDATED';
  payload: {
    blobName: string;
    description: string;
  };
}

export interface ApplicationDocumentUploadingAction {
  type: 'APPLICATION_DOCUMENT_UPLOADING';
  payload: {
    isUploadingDocument: boolean;
  };
}

export interface ApplicationDocumentUploadedAction {
  type: 'APPLICATION_DOCUMENT_UPLOADED';
  payload: {
    uploadedDocuments: ApplicationDocument[];
  };
}

export interface ApplicationDocumentRemovedAction {
  type: 'APPLICATION_DOCUMENT_REMOVED';
  payload: {
    removedBlobName: string;
  };
}

export interface ApplicationLoadingAction {
  type: 'APPLICATION_LOADING';
}

export interface ApplicationLoadedAction {
  type: 'APPLICATION_LOADED';
  payload: {
    application: ApplicationDetails;
    notes: ApplicationReviewNote[];
  };
}

export interface ApplicationLoadErroredAction {
  type: 'APPLICATION_LOAD_ERRORED';
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
    case 'ESTIMATION_TOOL_PAGE_LOADED':
      return onEstimationToolPageLoaded(draftState, action);
    case 'FUNDING_ORGANIZATION_LOADING':
      return onFundingOrganizationLoading(draftState);
    case 'FUNDING_ORGANIZATION_LOADED':
      return onFundingOrganizationLoaded(draftState, action);
    case 'FUNDING_ORGANIZATION_LOAD_ERRORED':
      return onFundingOrganizationLoadErrored(draftState);
    case 'APPLICATION_CREATED':
      return onApplicationCreated(draftState, action);
    case 'MAP_POLYGONS_UPDATED':
      return onMapPolygonsUpdated(draftState, action);
    case 'ESTIMATION_FORM_UPDATED':
      return onEstimationFormUpdated(draftState, action);
    case 'CONSUMPTIVE_USE_ESTIMATED':
      return onConsumptiveUseEstimated(draftState, action);
    case 'CONSUMPTIVE_USE_ADJUSTED':
      return onConsumptiveUseAdjusted(draftState, action);
    case 'APPLICATION_SUBMISSION_FORM_UPDATED':
      return onApplicationFormUpdated(draftState, action);
    case 'APPLICATION_DOCUMENT_UPDATED':
      return onApplicationDocumentUpdated(draftState, action);
    case 'APPLICATION_DOCUMENT_UPLOADING':
      return onApplicationDocumentUploading(draftState, action);
    case 'APPLICATION_DOCUMENT_UPLOADED':
      return onApplicationDocumentUploaded(draftState, action);
    case 'APPLICATION_DOCUMENT_REMOVED':
      return onApplicationDocumentRemoved(draftState, action);
    case 'APPLICATION_LOADING':
      return onApplicationLoading(draftState);
    case 'APPLICATION_LOADED':
      return onApplicationLoaded(draftState, action);
    case 'APPLICATION_LOAD_ERRORED':
      return onApplicationLoadErrored(draftState);
  }
};

const onDashboardApplicationsLoaded = (
  draftState: ConservationApplicationState,
  action: DashboardApplicationsLoadedAction,
): ConservationApplicationState => {
  draftState.dashboardApplications = action.payload.dashboardApplications;
  draftState.dashboardApplicationsStatistics = calculateApplicationStatistics(action.payload.dashboardApplications);
  return draftState;
};

const onDashboardApplicationsFiltered = (
  draftState: ConservationApplicationState,
  action: DashboardApplicationsFilteredAction,
): ConservationApplicationState => {
  const filteredApps = action.payload.applicationIds
    .map((appId) => draftState.dashboardApplications.find((app) => app.applicationId === appId))
    .filter((app) => app !== undefined);

  draftState.dashboardApplicationsStatistics = calculateApplicationStatistics(filteredApps);
  return draftState;
};

function calculateApplicationStatistics(applications: ApplicationDashboardListItem[]): ApplicationDashboardStatistics {
  const submittedApps = applications.length;
  const approvedApps = applications.filter((app) => app?.status === ConservationApplicationStatus.Approved).length;
  const inReviewApps = applications.filter((app) => app?.status === ConservationApplicationStatus.InReview).length;
  const rejectedApps = applications.filter((app) => app?.status === ConservationApplicationStatus.Rejected).length;
  const waterSavings = applications
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .filter((app) => app?.compensationRateUnits === CompensationRateUnits.AcreFeet)
    .reduce((sum, app) => sum + (app?.totalWaterVolumeSavingsAcreFeet ?? 0), 0);
  const totalObligation = applications
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .reduce((sum, app) => sum + (app?.totalObligationDollars ?? 0), 0);

  return {
    submittedApplications: submittedApps,
    acceptedApplications: approvedApps,
    rejectedApplications: rejectedApps,
    inReviewApplications: inReviewApps,
    cumulativeEstimatedSavingsAcreFeet: waterSavings,
    totalObligationDollars: totalObligation,
  };
}
const onEstimationToolPageLoaded = (
  draftState: ConservationApplicationState,
  { payload }: EstimationToolPageLoadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterRightNativeId = payload.waterRightNativeId;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onFundingOrganizationLoading = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.isLoadingFundingOrganization = true;
  draftState.loadFundingOrganizationErrored = false;
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

  draftState.isLoadingFundingOrganization = false;
  draftState.loadFundingOrganizationErrored = false;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onFundingOrganizationLoadErrored = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.loadFundingOrganizationErrored = true;
  draftState.isLoadingFundingOrganization = false;
  return draftState;
};

const onApplicationCreated = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationCreatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.waterConservationApplicationId = payload.waterConservationApplicationId;
  draftState.conservationApplication.waterConservationApplicationDisplayId =
    payload.waterConservationApplicationDisplayId;

  draftState.isCreatingApplication = true;

  checkCanEstimateConsumptiveUse(draftState);

  return draftState;
};

const onMapPolygonsUpdated = (
  draftState: ConservationApplicationState,
  { payload }: MapPolygonsUpdatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.estimateLocations = payload.polygons;
  draftState.conservationApplication.doPolygonsOverlap = payload.doPolygonsOverlap;

  if (payload.controlLocation) {
    draftState.conservationApplication.controlLocation = payload.controlLocation;
    draftState.conservationApplication.doesControlLocationOverlapWithPolygons =
      payload.doesControlLocationOverlapWithPolygons!;
  }

  resetConsumptiveUseEstimation(draftState);
  checkCanEstimateConsumptiveUse(draftState);
  computeCombinedPolygonData(draftState);
  resetApplicationFormLocationDetails(draftState);

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

const onConsumptiveUseEstimated = (
  draftState: ConservationApplicationState,
  { payload }: ApplicantConsumptiveUseEstimatedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.cumulativeTotalEtInAcreFeet = payload.cumulativeTotalEtInAcreFeet;
  application.conservationPayment = payload.conservationPayment;

  // combine polygon data
  for (let i = 0; i < application.estimateLocations.length; i++) {
    const polygon = application.estimateLocations[i];
    const matchingConsumptiveUseData = payload.dataCollections.find((data) => data.polygonWkt === polygon.polygonWkt)!;

    polygon.fieldName = `Field ${i + 1}`;
    polygon.waterConservationApplicationEstimateLocationId =
      matchingConsumptiveUseData.waterConservationApplicationEstimateLocationId;
    polygon.averageYearlyTotalEtInInches = matchingConsumptiveUseData.averageYearlyTotalEtInInches;
    polygon.averageYearlyTotalEtInAcreFeet = matchingConsumptiveUseData.averageYearlyTotalEtInAcreFeet;
    polygon.datapoints = matchingConsumptiveUseData.datapoints;
  }

  checkCanContinueToApplication(draftState);
  computeCombinedPolygonData(draftState);

  return draftState;
};

const onConsumptiveUseAdjusted = (
  draftState: ConservationApplicationState,
  { payload }: ReviewerConsumptiveUseEstimateAdjustedAction,
): ConservationApplicationState => {
  const application = draftState.conservationApplication;

  application.cumulativeTotalEtInAcreFeet = payload.cumulativeTotalEtInAcreFeet;
  application.cumulativeNetEtInAcreFeet = payload.cumulativeNetEtInAcreFeet;
  application.conservationPayment = payload.conservationPayment;

  // combine polygon data
  for (let i = 0; i < application.estimateLocations.length; i++) {
    const polygon = application.estimateLocations[i];
    const matchingConsumptiveUseData = payload.dataCollections.find((data) => data.polygonWkt === polygon.polygonWkt)!;

    polygon.fieldName = `Field ${i + 1}`;
    polygon.waterConservationApplicationEstimateLocationId =
      matchingConsumptiveUseData.waterConservationApplicationEstimateLocationId;
    polygon.averageYearlyTotalEtInInches = matchingConsumptiveUseData.averageYearlyTotalEtInInches;
    polygon.averageYearlyTotalEtInAcreFeet = matchingConsumptiveUseData.averageYearlyTotalEtInAcreFeet;
    polygon.averageYearlyNetEtInInches = matchingConsumptiveUseData.averageYearlyNetEtInInches;
    polygon.averageYearlyNetEtInAcreFeet = matchingConsumptiveUseData.averageYearlyNetEtInAcreFeet;
    polygon.datapoints = matchingConsumptiveUseData.datapoints;
  }

  application.controlLocation = payload.controlDataCollection;

  computeCombinedPolygonData(draftState);

  return draftState;
};

const onApplicationFormUpdated = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationSubmissionFormUpdatedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.applicationSubmissionForm = {
    ...draftState.conservationApplication.applicationSubmissionForm,
    ...payload.formValues,
  };

  computeCombinedPolygonData(draftState);

  return draftState;
};

const onApplicationDocumentUpdated = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationDocumentUpdatedAction,
): ConservationApplicationState => {
  const document = draftState.conservationApplication.supportingDocuments.find(
    (doc) => doc.blobName === payload.blobName,
  );
  if (document) {
    document.description = payload.description;
  }

  return draftState;
};

const onApplicationDocumentUploading = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationDocumentUploadingAction,
): ConservationApplicationState => {
  draftState.isUploadingDocument = payload.isUploadingDocument;
  return draftState;
};

const onApplicationDocumentUploaded = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationDocumentUploadedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.supportingDocuments = [
    ...draftState.conservationApplication.supportingDocuments,
    ...payload.uploadedDocuments,
  ];
  return draftState;
};

const onApplicationDocumentRemoved = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationDocumentRemovedAction,
): ConservationApplicationState => {
  const filteredDocuments = draftState.conservationApplication.supportingDocuments.filter(
    (doc) => doc.blobName !== payload.removedBlobName,
  );
  draftState.conservationApplication.supportingDocuments = filteredDocuments;
  return draftState;
};

const onApplicationLoading = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.isLoadingApplication = true;
  draftState.loadApplicationErrored = false;
  return draftState;
};

const onApplicationLoaded = (
  draftState: ConservationApplicationState,
  { payload }: ApplicationLoadedAction,
): ConservationApplicationState => {
  const draftApplication = draftState.conservationApplication;
  const application = payload.application;

  draftApplication.waterConservationApplicationId = application.id;
  draftApplication.waterRightNativeId = application.waterRightNativeId;
  draftApplication.waterConservationApplicationDisplayId = application.applicationDisplayId;
  draftApplication.fundingOrganizationId = application.fundingOrganizationId;
  // funding org name, open et modal name, date range start / end, compensation rate model - all of these are funding org-related data points that are loaded based on the water right

  draftApplication.desiredCompensationDollars = application.estimate.compensationRateDollars;
  draftApplication.desiredCompensationUnits = application.estimate.compensationRateUnits;
  draftApplication.cumulativeTotalEtInAcreFeet = application.estimate.cumulativeTotalEtInAcreFeet;
  draftApplication.conservationPayment = application.estimate.estimatedCompensationDollars;
  draftApplication.applicationSubmissionForm = {
    ...application.submission,

    agentName: application.submission.agentName ?? '',
    agentEmail: application.submission.agentEmail ?? '',
    agentPhoneNumber: application.submission.agentPhoneNumber ?? '',
    agentAdditionalDetails: application.submission.agentAdditionalDetails ?? '',

    canalOrIrrigationEntityName: application.submission.canalOrIrrigationEntityName ?? '',
    canalOrIrrigationEntityEmail: application.submission.canalOrIrrigationEntityEmail ?? '',
    canalOrIrrigationEntityPhoneNumber: application.submission.canalOrIrrigationEntityPhoneNumber ?? '',
    canalOrIrrigationAdditionalDetails: application.submission.canalOrIrrigationAdditionalDetails ?? '',

    estimationSupplementaryDetails: application.submission.estimationSupplementaryDetails ?? '',
    conservationPlanAdditionalInfo: application.submission.conservationPlanAdditionalInfo ?? '',

    fieldDetails: application.estimate.locations.map((location) => ({
      waterConservationApplicationEstimateLocationId: location.id,
      additionalDetails: location.additionalDetails ?? '',
    })),
  };
  draftApplication.estimateLocations = application.estimate.locations.map(
    (location, index): PartialPolygonData => ({
      waterConservationApplicationEstimateLocationId: location.id,
      polygonWkt: location.polygonWkt,
      drawToolType: location.drawToolType,
      acreage: location.polygonAreaInAcres,
      additionalDetails: location.additionalDetails ?? '',
      fieldName: `Field ${index + 1}`,
      datapoints: location.consumptiveUses,
      centerPoint: truncate(center(convertWktToGeometry(location.polygonWkt))).geometry,
      // this info is not stored in the db, so it cannot be hydrated into state. it comes from the ET data
      averageYearlyTotalEtInAcreFeet: undefined,
      averageYearlyTotalEtInInches: undefined,
    }),
  );
  draftApplication.doPolygonsOverlap = false;
  draftApplication.polygonAcreageSum = application.estimate.locations.reduce(
    (sum, location) => sum + location.polygonAreaInAcres,
    0,
  );
  draftApplication.supportingDocuments = application.supportingDocuments.map(
    (doc): ApplicationDocument => ({
      id: doc.id,
      blobName: doc.blobName,
      fileName: doc.fileName,
      description: doc.description ?? '',
    }),
  );
  draftApplication.reviewerNotes = payload.notes;

  draftState.isLoadingApplication = false;
  draftState.loadApplicationErrored = false;

  return draftState;
};

const onApplicationLoadErrored = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.loadApplicationErrored = true;
  draftState.isLoadingApplication = false;
  return draftState;
};

const checkCanEstimateConsumptiveUse = (draftState: ConservationApplicationState): void => {
  const app = draftState.conservationApplication;

  const dollarsHasValue = !!app.desiredCompensationDollars;
  const unitsHasValue = !!app.desiredCompensationUnits;

  draftState.canEstimateConsumptiveUse =
    !!app.waterConservationApplicationId &&
    !!app.waterRightNativeId &&
    !!app.openEtModelName &&
    !!app.dateRangeStart &&
    !!app.dateRangeEnd &&
    !!app.estimateLocations &&
    // cannot estimate consumptive use if the user has provided *only one* of dollars or units
    ((dollarsHasValue && unitsHasValue) || (!dollarsHasValue && !unitsHasValue)) &&
    app.estimateLocations.length > 0 &&
    app.estimateLocations.length <= 20 &&
    app.estimateLocations.every((p) => p.acreage! <= 50000) &&
    !app.doPolygonsOverlap &&
    // applicant does not have a control location
    // technical reviewer must have a control location, which cannot be contained in any of the polygons
    (app.controlLocation === undefined || (!!app.controlLocation && !app.doesControlLocationOverlapWithPolygons));
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
    !!app.cumulativeTotalEtInAcreFeet &&
    !!app.conservationPayment &&
    !!app.estimateLocations &&
    app.estimateLocations.length > 0 &&
    app.estimateLocations.every((p) => p.acreage! <= 50000) &&
    !app.doPolygonsOverlap;
};

const resetConsumptiveUseEstimation = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.cumulativeTotalEtInAcreFeet = undefined;
  draftState.conservationApplication.cumulativeNetEtInAcreFeet = undefined;
  draftState.conservationApplication.conservationPayment = undefined;

  // this `reset` method is activated when:
  // * the applicant updates polygons on the map
  // * a technical reviewer updates polygons on the map or adds a control location
  // * the applicant modifies a form value in the Estimation Tool sidebar

  // for the first case and the second case, all polygon data will be overwritten. nothing needs to happen here.
  // for the third case, any data on the map will remain the same, but the consumptive use data needs to be reset
  const combinedPolygonDataCopy = [...draftState.conservationApplication.estimateLocations];
  for (let i = 0; i < combinedPolygonDataCopy.length; i++) {
    const polygon = combinedPolygonDataCopy[i];

    const polygonPostMapSelection: MapSelectionPolygonData = {
      polygonWkt: polygon.polygonWkt!,
      drawToolType: polygon.drawToolType!,
      acreage: polygon.acreage!,
    };

    combinedPolygonDataCopy[i] = polygonPostMapSelection;
  }
  draftState.conservationApplication.estimateLocations = combinedPolygonDataCopy;

  // regarding the third case, the applicant will not have any control locations in state, and so nothing should need to be reset here.

  draftState.canContinueToApplication = false;
};

const resetApplicationFormLocationDetails = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.applicationSubmissionForm.fieldDetails = [];
};

const computeCombinedPolygonData = (draftState: ConservationApplicationState): void => {
  let polygonAcreageSum = 0;
  for (let i = 0; i < draftState.conservationApplication.estimateLocations.length; i++) {
    // compute data on the polygon object
    const polygon = draftState.conservationApplication.estimateLocations[i];

    // polygonWkt is guaranteed to exist because we get it from the map, not from the ET data
    const centerPoint = truncate(center(convertWktToGeometry(polygon.polygonWkt!))).geometry;

    // find the additional details for this polygon, which are provided by the user on the Application Create form
    let additionalDetailsTrackedFormValue = undefined;
    if (polygon.waterConservationApplicationEstimateLocationId) {
      additionalDetailsTrackedFormValue =
        draftState.conservationApplication.applicationSubmissionForm.fieldDetails.find(
          (fieldDetail) =>
            fieldDetail.waterConservationApplicationEstimateLocationId ===
            polygon.waterConservationApplicationEstimateLocationId,
        )?.additionalDetails ?? '';
    }

    draftState.conservationApplication.estimateLocations[i] = {
      // incorporate computed/derived data
      additionalDetails: additionalDetailsTrackedFormValue,
      centerPoint,
      // carry over existing data
      waterConservationApplicationEstimateLocationId: polygon.waterConservationApplicationEstimateLocationId,
      polygonWkt: polygon.polygonWkt,
      drawToolType: polygon.drawToolType,
      acreage: polygon.acreage,
      averageYearlyTotalEtInInches: polygon.averageYearlyTotalEtInInches,
      averageYearlyTotalEtInAcreFeet: polygon.averageYearlyTotalEtInAcreFeet,
      averageYearlyNetEtInInches: polygon.averageYearlyNetEtInInches,
      averageYearlyNetEtInAcreFeet: polygon.averageYearlyNetEtInAcreFeet,
      fieldName: polygon.fieldName,
      datapoints: polygon.datapoints,
    };

    // compute data concerning all the polygons
    // these calculations assume that none of the polygons intersect with each other
    polygonAcreageSum += polygon.acreage!;
  }

  draftState.conservationApplication.polygonAcreageSum = polygonAcreageSum;
};
