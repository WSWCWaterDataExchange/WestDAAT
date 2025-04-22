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
import { MapSelectionPointData, PartialPointData } from '../data-contracts/CombinedPointData';
import { GeometryEtDatapoint } from '../data-contracts/GeometryEtDatapoint';
import { ReviewPipeline } from '../data-contracts/ReviewPipeline';
import { PointEtDataCollection } from '../data-contracts/PointEtDataCollection';
import { conservationApplicationMaxPolygonAcreage, conservationApplicationMaxPolygonCount } from '../config/constants';

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
    isDirty: boolean;
    isApplicationSubmissionFormValid: boolean;
    polygonAcreageSum: number;
    supportingDocuments: ApplicationDocument[];
    reviewerNotes: ApplicationReviewNote[];
    reviewPipeline: ReviewPipeline;
    status: ConservationApplicationStatus;
  };
  displayDataTable: boolean;
  isCreatingApplication: boolean;
  isUploadingDocument: boolean;
  isLoadingApplication: boolean;
  loadApplicationErrored: boolean;
  isLoadingFundingOrganization: boolean;
  loadFundingOrganizationErrored: boolean;
  isLoadingReviewerConsumptiveUseEstimate: boolean;
  reviewerConsumptiveUseEstimateHasErrored: boolean;
  canApplicantEstimateConsumptiveUse: boolean;
  canReviewerEstimateConsumptiveUse: boolean;
  canContinueToApplication: boolean;
  controlPointLocationHasBeenSaved: boolean;
}

export const defaultState = (): ConservationApplicationState => ({
  dashboardApplications: [],
  dashboardApplicationsStatistics: {
    submittedApplications: null,
    approvedApplications: null,
    deniedApplications: null,
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
    isDirty: false,
    isApplicationSubmissionFormValid: false,
    polygonAcreageSum: 0,
    supportingDocuments: [],
    reviewerNotes: [],
    reviewPipeline: {
      reviewSteps: [],
    },
    status: ConservationApplicationStatus.Unknown,
  },
  displayDataTable: false,
  isCreatingApplication: false,
  isUploadingDocument: false,
  isLoadingApplication: false,
  loadApplicationErrored: false,
  isLoadingFundingOrganization: false,
  loadFundingOrganizationErrored: false,
  isLoadingReviewerConsumptiveUseEstimate: false,
  reviewerConsumptiveUseEstimateHasErrored: false,
  canApplicantEstimateConsumptiveUse: false,
  canReviewerEstimateConsumptiveUse: false,
  canContinueToApplication: false,
  controlPointLocationHasBeenSaved: false,
});

export type ApplicationAction =
  | DashboardApplicationsLoadedAction
  | DashboardApplicationsFilteredAction
  | EstimationToolPageLoadedAction
  | FundingOrganizationLoadingAction
  | FundingOrganizationLoadedAction
  | FundingOrganizationLoadErrored
  | MapPolygonsUpdatedAction
  | ReviewerMapDataUpdatedAction
  | EstimationFormUpdatedAction
  | ApplicationCreatedAction
  | ApplicantConsumptiveUseEstimatedAction
  | ReviewerConsumptiveUseEstimateStartedAction
  | ReviewerConsumptiveUseEstimateErroredAction
  | ReviewerConsumptiveUseEstimatedAction
  | ApplicationSubmissionFormUpdatedAction
  | ApplicationSavedAction
  | ApplicationDocumentUpdatedAction
  | ApplicationDocumentUploadingAction
  | ApplicationDocumentUploadedAction
  | ApplicationDocumentRemovedAction
  | ApplicationLoadingAction
  | ApplicationLoadedAction
  | ApplicationLoadErroredAction
  | ApplicationReviewerNoteAddedAction
  | DataTableToggledAction;

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
  };
}

export interface ReviewerMapDataUpdatedAction {
  type: 'REVIEWER_MAP_DATA_UPDATED';
  payload: {
    polygons: MapSelectionPolygonData[];
    doPolygonsOverlap: boolean;
    controlLocation: MapSelectionPointData | undefined;
    doesControlLocationOverlapWithPolygons: boolean | undefined;
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
  type: 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED';
  payload: {
    cumulativeTotalEtInAcreFeet: number;
    conservationPayment: number | undefined;
    dataCollections: PolygonEtDataCollection[];
  };
}

export interface ReviewerConsumptiveUseEstimateStartedAction {
  type: 'REVIEWER_CONSUMPTIVE_USE_ESTIMATE_STARTED';
}

export interface ReviewerConsumptiveUseEstimateErroredAction {
  type: 'REVIEWER_CONSUMPTIVE_USE_ESTIMATE_ERRORED';
}

export interface ReviewerConsumptiveUseEstimatedAction {
  type: 'REVIEWER_CONSUMPTIVE_USE_ESTIMATED';
  payload: {
    cumulativeTotalEtInAcreFeet: number;
    cumulativeNetEtInAcreFeet: number;
    conservationPayment: number;
    dataCollections: PolygonEtDataCollection[];
    controlDataCollection: PointEtDataCollection;
    estimateWasSaved: boolean;
  };
}
export interface ApplicationSubmissionFormUpdatedAction {
  type: 'APPLICATION_SUBMISSION_FORM_UPDATED';
  payload: {
    formValues: ApplicationSubmissionFormData;
  };
}

export interface ApplicationSavedAction {
  type: 'APPLICATION_SAVED';
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
    reviewPipeline: ReviewPipeline;
  };
}

export interface ApplicationLoadErroredAction {
  type: 'APPLICATION_LOAD_ERRORED';
}

export interface ApplicationReviewerNoteAddedAction {
  type: 'APPLICATION_NOTE_ADDED';
  payload: {
    note: ApplicationReviewNote;
  };
}

export interface DataTableToggledAction {
  type: 'DATA_TABLE_TOGGLED';
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
    case 'REVIEWER_MAP_DATA_UPDATED':
      return onReviewerMapPolygonsUpdated(draftState, action);
    case 'ESTIMATION_FORM_UPDATED':
      return onEstimationFormUpdated(draftState, action);
    case 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED':
      return onApplicantConsumptiveUseEstimated(draftState, action);
    case 'REVIEWER_CONSUMPTIVE_USE_ESTIMATE_STARTED':
      return onReviewerConsumptiveUseEstimateStartedAction(draftState);
    case 'REVIEWER_CONSUMPTIVE_USE_ESTIMATE_ERRORED':
      return onReviewerConsumptiveUseEstimateErroredAction(draftState);
    case 'REVIEWER_CONSUMPTIVE_USE_ESTIMATED':
      return onReviewerConsumptiveUseEstimated(draftState, action);
    case 'APPLICATION_SUBMISSION_FORM_UPDATED':
      return onApplicationFormUpdated(draftState, action);
    case 'APPLICATION_SAVED':
      return onApplicationUpdatesSaved(draftState);
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
    case 'APPLICATION_NOTE_ADDED':
      return onApplicationReviewerNoteAdded(draftState, action);
    case 'DATA_TABLE_TOGGLED':
      return onDataTableToggled(draftState);
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
  const inTechReview = applications.filter(
    (app) => app?.status === ConservationApplicationStatus.InTechnicalReview,
  ).length;
  const inFinalRevew = applications.filter((app) => app?.status === ConservationApplicationStatus.InFinalReview).length;
  const rejectedApps = applications.filter((app) => app?.status === ConservationApplicationStatus.Denied).length;
  const inReviewApps = inTechReview + inFinalRevew;
  const waterSavings = applications
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .filter((app) => app?.compensationRateUnits === CompensationRateUnits.AcreFeet)
    .reduce((sum, app) => sum + (app?.totalWaterVolumeSavingsAcreFeet ?? 0), 0);
  const totalObligation = applications
    .filter((app) => app?.status === ConservationApplicationStatus.Approved)
    .reduce((sum, app) => sum + (app?.totalObligationDollars ?? 0), 0);

  return {
    submittedApplications: submittedApps,
    approvedApplications: approvedApps,
    deniedApplications: rejectedApps,
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

  resetConsumptiveUseEstimation(draftState);
  checkCanEstimateConsumptiveUse(draftState);
  updatePolygonAcreageSum(draftState);
  computeCombinedPolygonData(draftState);
  resetApplicationFormLocationDetails(draftState);

  return draftState;
};

const onReviewerMapPolygonsUpdated = (
  draftState: ConservationApplicationState,
  { payload }: ReviewerMapDataUpdatedAction,
): ConservationApplicationState => {
  // this action handles these scenarios:
  // * map polygons updated
  // * map control location updated

  // important: this method assumes that only one polygon or point can change at a time,
  // because this method is fired every time the user adjusts a feature on the map

  const mergePolygonChanges = () => {
    const existingPolygonWkts = new Set(draftState.conservationApplication.estimateLocations.map((p) => p.polygonWkt!));
    const newPolygonWkts = new Set(payload.polygons.map((p) => p.polygonWkt));

    const anyPolygonsAddedOrRemoved = existingPolygonWkts.size !== newPolygonWkts.size;

    const allPolygonWkts = [...new Set([...existingPolygonWkts, ...newPolygonWkts])];
    // symmetric difference: the set of elements that exist in either set A or set B, but not in both sets
    // set operations are not defined :')
    const polygonWktsSymmetricDifference = new Set(
      allPolygonWkts.filter((wkt) => !(existingPolygonWkts.has(wkt) && newPolygonWkts.has(wkt))),
    );
    const anyPolygonsPositionChanged = polygonWktsSymmetricDifference.size > 0;

    const anyChangeInPolygons = anyPolygonsAddedOrRemoved || anyPolygonsPositionChanged;

    if (!anyChangeInPolygons) {
      return;
    }

    if (anyPolygonsAddedOrRemoved) {
      if (newPolygonWkts.size > existingPolygonWkts.size) {
        // polygon added
        const newPolygon = payload.polygons.find((p) => !existingPolygonWkts.has(p.polygonWkt!))!;

        draftState.conservationApplication.estimateLocations.push({
          ...newPolygon,
        });
      } else {
        // polygon removed
        const removedPolygon = draftState.conservationApplication.estimateLocations.find(
          (p) => !newPolygonWkts.has(p.polygonWkt!),
        )!;

        draftState.conservationApplication.estimateLocations =
          draftState.conservationApplication.estimateLocations.filter(
            (p) => p.polygonWkt !== removedPolygon.polygonWkt,
          );

        // important - may also need to update the ApplicationSubmission form
        if (removedPolygon.waterConservationApplicationEstimateLocationId) {
          draftState.conservationApplication.applicationSubmissionForm.fieldDetails =
            draftState.conservationApplication.applicationSubmissionForm.fieldDetails.filter(
              (location) =>
                location.waterConservationApplicationEstimateLocationId !==
                removedPolygon.waterConservationApplicationEstimateLocationId,
            );
        }
      }
    } else {
      // polygon modified
      // find the wkt that changed
      const estimateLocation = draftState.conservationApplication.estimateLocations.find(
        (p) => !newPolygonWkts.has(p.polygonWkt!),
      )!;
      const modifiedPolygon = payload.polygons.find((p) => !existingPolygonWkts.has(p.polygonWkt!))!;

      // sanity check - if the polygon in state has an id, and if the polygon in the payload has an id, then they must match.
      // if they do not match, then we have encountered an issue where a polygon's geometry has become decoupled from its properties.
      if (
        !!estimateLocation.waterConservationApplicationEstimateLocationId &&
        !!modifiedPolygon.waterConservationApplicationEstimateLocationId &&
        estimateLocation.waterConservationApplicationEstimateLocationId !==
          modifiedPolygon.waterConservationApplicationEstimateLocationId
      ) {
        throw new Error(
          'Polygon ID mismatch - a polygon was moved but its ID has not been properly tracked. Please report this error.',
        );
      }

      // update the state data
      Object.assign(estimateLocation, modifiedPolygon);
    }

    draftState.conservationApplication.doPolygonsOverlap = payload.doPolygonsOverlap;
  };

  const mergeControlLocationChanges = () => {
    const existingControlLocationWkt = draftState.conservationApplication.controlLocation?.pointWkt;
    const newControlLocationWkt = payload.controlLocation?.pointWkt;

    // this check covers the control location being added, deleted, or moved
    const controlLocationUpdated = existingControlLocationWkt !== newControlLocationWkt;

    if (controlLocationUpdated) {
      draftState.conservationApplication.controlLocation = {
        // new data
        pointWkt: payload.controlLocation?.pointWkt,
        // preserve id if we have it
        waterConservationApplicationEstimateControlLocationId:
          draftState.conservationApplication.controlLocation?.waterConservationApplicationEstimateControlLocationId,
        // unavoidable data loss
        averageYearlyTotalEtInInches: undefined,
        datapoints: [],
      };
      draftState.conservationApplication.doesControlLocationOverlapWithPolygons =
        payload.doesControlLocationOverlapWithPolygons ?? false;
    }
  };

  // perform the updates
  mergePolygonChanges();
  mergeControlLocationChanges();

  // side effects
  resetConsumptiveUseEstimation(draftState);
  updatePolygonAcreageSum(draftState);
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

const onApplicantConsumptiveUseEstimated = (
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
      matchingConsumptiveUseData.waterConservationApplicationEstimateLocationId ?? undefined;
    polygon.averageYearlyTotalEtInInches = matchingConsumptiveUseData.averageYearlyTotalEtInInches;
    polygon.averageYearlyTotalEtInAcreFeet = matchingConsumptiveUseData.averageYearlyTotalEtInAcreFeet;
    polygon.datapoints = matchingConsumptiveUseData.datapoints;
  }

  draftState.displayDataTable = true;

  checkCanContinueToApplication(draftState);
  updatePolygonAcreageSum(draftState);
  computeCombinedPolygonData(draftState);

  return draftState;
};

const onReviewerConsumptiveUseEstimateStartedAction = (
  draftState: ConservationApplicationState,
): ConservationApplicationState => {
  draftState.isLoadingReviewerConsumptiveUseEstimate = true;
  draftState.reviewerConsumptiveUseEstimateHasErrored = false;
  return draftState;
};

const onReviewerConsumptiveUseEstimateErroredAction = (
  draftState: ConservationApplicationState,
): ConservationApplicationState => {
  draftState.isLoadingReviewerConsumptiveUseEstimate = false;
  draftState.reviewerConsumptiveUseEstimateHasErrored = true;
  return draftState;
};

const onReviewerConsumptiveUseEstimated = (
  draftState: ConservationApplicationState,
  { payload }: ReviewerConsumptiveUseEstimatedAction,
): ConservationApplicationState => {
  draftState.isLoadingReviewerConsumptiveUseEstimate = false;
  draftState.reviewerConsumptiveUseEstimateHasErrored = false;

  // if an estimate has already been saved, we don't want to overwrite that flag
  if (!draftState.controlPointLocationHasBeenSaved) {
    draftState.controlPointLocationHasBeenSaved = payload.estimateWasSaved;
  }

  const application = draftState.conservationApplication;

  application.cumulativeTotalEtInAcreFeet = payload.cumulativeTotalEtInAcreFeet;
  application.cumulativeNetEtInAcreFeet = payload.cumulativeNetEtInAcreFeet;
  application.conservationPayment = payload.conservationPayment;

  // combine polygon data and update field names
  // start with the highest field name index + 1
  // ie if "Field 3" exists, start with "Field 4"
  const existingFieldNameIndices = application.estimateLocations
    .filter((location) => !!location.fieldName)
    .map((location): number => {
      // validate field name was generated in expected format
      if (!location.fieldName!.startsWith('Field ')) {
        throw new Error(`Field name ${location.fieldName} is not in expected format`);
      }

      return Number(location.fieldName!.split(' ')[1]);
    });
  const maxFieldNameIndex = existingFieldNameIndices.reduce((prev, curr) => Math.max(prev, curr), 0);

  let assignedFieldNameIndex = maxFieldNameIndex + 1;
  for (let i = 0; i < application.estimateLocations.length; i++) {
    // update polygon entry
    const polygon = application.estimateLocations[i];
    const matchingConsumptiveUseData = payload.dataCollections.find((data) => data.polygonWkt === polygon.polygonWkt)!;

    Object.assign(application.estimateLocations[i], matchingConsumptiveUseData);

    // update field name
    if (!polygon.fieldName) {
      polygon.fieldName = generateFieldName(assignedFieldNameIndex);
      assignedFieldNameIndex++;
    }
  }

  // update control location
  application.controlLocation = {
    ...application.controlLocation,
    waterConservationApplicationEstimateControlLocationId:
      payload.controlDataCollection.waterConservationApplicationEstimateControlLocationId,
    averageYearlyTotalEtInInches: payload.controlDataCollection.averageYearlyTotalEtInInches,
    datapoints: payload.controlDataCollection.datapoints,
  };

  draftState.displayDataTable = true;

  updatePolygonAcreageSum(draftState);
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

  updatePolygonAcreageSum(draftState);
  computeCombinedPolygonData(draftState);

  draftState.conservationApplication.isDirty = true;

  return draftState;
};

const onApplicationUpdatesSaved = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.conservationApplication.isDirty = false;
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

  draftState.conservationApplication.isDirty = true;

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
  draftState.conservationApplication.isDirty = true;
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
  draftState.conservationApplication.isDirty = true;
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
  draftApplication.cumulativeNetEtInAcreFeet = application.estimate.cumulativeNetEtInAcreFeet ?? undefined;
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
      fieldName: generateFieldName(index + 1),
      datapoints: location.waterMeasurements,
      centerPoint: truncate(center(convertWktToGeometry(location.polygonWkt))).geometry,
      // this info is not stored in the db, so it cannot be hydrated into state. it comes from the ET data
      averageYearlyTotalEtInAcreFeet: undefined,
      averageYearlyTotalEtInInches: undefined,
    }),
  );
  draftApplication.doPolygonsOverlap = false;

  const controlLocation = application.estimate.controlLocation;
  if (controlLocation) {
    draftApplication.controlLocation = {
      waterConservationApplicationEstimateControlLocationId: controlLocation.id,
      pointWkt: controlLocation.pointWkt,
      datapoints: application.estimate.controlLocation.waterMeasurements.map(
        (measurement): GeometryEtDatapoint => ({
          year: measurement.year,
          totalEtInInches: measurement.totalEtInInches,
          effectivePrecipitationInInches: null,
          netEtInInches: null,
        }),
      ),
    };
    draftState.controlPointLocationHasBeenSaved = true;
  }
  draftApplication.doesControlLocationOverlapWithPolygons = false;

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

  draftApplication.reviewPipeline = payload.reviewPipeline;
  draftApplication.status = application.status;

  draftState.isLoadingApplication = false;
  draftState.loadApplicationErrored = false;
  draftState.conservationApplication.isDirty = false;

  return draftState;
};

const onApplicationLoadErrored = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.loadApplicationErrored = true;
  draftState.isLoadingApplication = false;
  return draftState;
};

const checkCanEstimateConsumptiveUse = (draftState: ConservationApplicationState): void => {
  checkCanApplicantEstimateConsumptiveUse(draftState);
  checkCanReviewerEstimateConsumptiveUse(draftState);
};

const checkCanApplicantEstimateConsumptiveUse = (draftState: ConservationApplicationState): void => {
  const app = draftState.conservationApplication;

  const dollarsHasValue = !!app.desiredCompensationDollars;
  const unitsHasValue = !!app.desiredCompensationUnits;

  draftState.canApplicantEstimateConsumptiveUse =
    !!app.waterConservationApplicationId &&
    !!app.waterRightNativeId &&
    !!app.openEtModelName &&
    !!app.dateRangeStart &&
    !!app.dateRangeEnd &&
    !!app.estimateLocations &&
    // cannot estimate consumptive use if the user has provided *only one* of dollars or units
    ((dollarsHasValue && unitsHasValue) || (!dollarsHasValue && !unitsHasValue)) &&
    app.estimateLocations.length > 0 &&
    app.estimateLocations.length <= conservationApplicationMaxPolygonCount &&
    app.estimateLocations.every((p) => p.acreage! <= conservationApplicationMaxPolygonAcreage) &&
    !app.doPolygonsOverlap;
};

const checkCanReviewerEstimateConsumptiveUse = (draftState: ConservationApplicationState): void => {
  const app = draftState.conservationApplication;

  draftState.canReviewerEstimateConsumptiveUse =
    !!app.waterConservationApplicationId &&
    !!app.estimateLocations &&
    app.estimateLocations.length > 0 &&
    app.estimateLocations.length <= conservationApplicationMaxPolygonCount &&
    app.estimateLocations.every((p) => p.acreage! <= conservationApplicationMaxPolygonAcreage) &&
    !app.doPolygonsOverlap &&
    !!app.controlLocation?.pointWkt &&
    !app.doesControlLocationOverlapWithPolygons;
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
    app.estimateLocations.every((p) => p.acreage! <= conservationApplicationMaxPolygonAcreage) &&
    !app.doPolygonsOverlap;
};

const resetConsumptiveUseEstimation = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.cumulativeTotalEtInAcreFeet = undefined;
  draftState.conservationApplication.cumulativeNetEtInAcreFeet = undefined;
  draftState.conservationApplication.conservationPayment = undefined;

  // this `reset` method is activated when:
  // * the user updates polygons on the map
  // * the reviewer updates polygons or the control location on the map
  // * the user modifies a form value in the Estimation Tool sidebar

  // polygon data:
  // for the first case, all polygon data will be overwritten. nothing needs to happen here.
  // for the second case and for the third case, any data on the map will remain the same,
  // - but the consumptive use data needs to be reset.
  const combinedPolygonDataCopy = [...draftState.conservationApplication.estimateLocations];
  for (let i = 0; i < combinedPolygonDataCopy.length; i++) {
    const polygon = combinedPolygonDataCopy[i];

    const polygonPostMapSelection: MapSelectionPolygonData = {
      waterConservationApplicationEstimateLocationId: polygon.waterConservationApplicationEstimateLocationId,
      polygonWkt: polygon.polygonWkt!,
      drawToolType: polygon.drawToolType!,
      acreage: polygon.acreage!,
    };

    combinedPolygonDataCopy[i] = {
      // preserve data related to the map
      ...polygonPostMapSelection,
      // preserve if possible
      additionalDetails: polygon.additionalDetails,
      centerPoint: polygon.centerPoint,
      fieldName: polygon.fieldName,
      // reset consumptive use data
      averageYearlyTotalEtInInches: undefined,
      averageYearlyTotalEtInAcreFeet: undefined,
      averageYearlyNetEtInInches: undefined,
      averageYearlyNetEtInAcreFeet: undefined,
      datapoints: [],
    };
  }
  draftState.conservationApplication.estimateLocations = combinedPolygonDataCopy;

  // control location data:
  // for the first case and the third case, the control location should not exist. nothing needs to happen
  // for the second case, the control location must have its consumptive use data reset
  if (draftState.conservationApplication.controlLocation) {
    draftState.conservationApplication.controlLocation = {
      ...draftState.conservationApplication.controlLocation,
      averageYearlyTotalEtInInches: undefined,
      datapoints: [],
    };
  }

  draftState.canContinueToApplication = false;
};

const resetApplicationFormLocationDetails = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.applicationSubmissionForm.fieldDetails = [];
};

const computeCombinedPolygonData = (draftState: ConservationApplicationState): void => {
  for (let i = 0; i < draftState.conservationApplication.estimateLocations.length; i++) {
    // compute data on the polygon object
    const polygon = draftState.conservationApplication.estimateLocations[i];

    // polygonWkt is guaranteed to exist because we get it from the map, not from the ET data
    const centerPoint = truncate(center(convertWktToGeometry(polygon.polygonWkt!))).geometry;

    // find the additional details for this polygon, which are provided by the user on the Application Create form
    let additionalDetailsTrackedFormValue = polygon.additionalDetails;
    if (!polygon.additionalDetails) {
      if (polygon.waterConservationApplicationEstimateLocationId) {
        additionalDetailsTrackedFormValue =
          draftState.conservationApplication.applicationSubmissionForm.fieldDetails.find(
            (fieldDetail) =>
              fieldDetail.waterConservationApplicationEstimateLocationId ===
              polygon.waterConservationApplicationEstimateLocationId,
          )?.additionalDetails ?? '';
      }
    }

    draftState.conservationApplication.estimateLocations[i] = {
      // carry over existing data
      ...polygon,
      // incorporate computed/derived data
      additionalDetails: additionalDetailsTrackedFormValue,
      centerPoint,
    };
  }
};

const updatePolygonAcreageSum = (draftState: ConservationApplicationState): void => {
  draftState.conservationApplication.polygonAcreageSum = draftState.conservationApplication.estimateLocations.reduce(
    (sum, location) => sum + location.acreage!,
    0,
  );
};

const onApplicationReviewerNoteAdded = (
  draftState: ConservationApplicationState,
  action: ApplicationReviewerNoteAddedAction,
): ConservationApplicationState => {
  draftState.conservationApplication.reviewerNotes.push(action.payload.note);
  return draftState;
};

const onDataTableToggled = (draftState: ConservationApplicationState): ConservationApplicationState => {
  draftState.displayDataTable = !draftState.displayDataTable;
  return draftState;
};

const generateFieldName = (index: number): string => {
  return `Field ${index}`;
};
