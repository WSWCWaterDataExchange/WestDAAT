import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { defaultApplicationSubmissionFormData } from '../data-contracts/ApplicationSubmissionFormData';
import { ApplicationDocument } from '../data-contracts/ApplicationDocuments';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import {
  ApplicationLoadedAction,
  ConservationApplicationState,
  defaultState,
  reducer,
  ReviewerConsumptiveUseEstimatedAction,
  ReviewerMapDataUpdatedAction,
} from './ConservationApplicationState';
import { MapSelectionPolygonData } from '../data-contracts/CombinedPolygonData';
import { ApplicationDetails } from '../data-contracts/ApplicationDetails';
import { applicationDetailsMock } from '../mocks/ApplicationDetails.mock';
import { ApplicationReviewNote } from '../data-contracts/ApplicationReviewNote';
import { DrawToolType } from '../data-contracts/DrawToolType';
import { ReviewStepStatus } from '../data-contracts/ReviewStepStatus';
import { ReviewStepType } from '../data-contracts/ReviewStepType';
import { PolygonEtDataCollection } from '../data-contracts/PolygonEtDataCollection';

const shouldApplicantBeAbleToPerformConsumptiveUseEstimate = (
  state: ConservationApplicationState,
  expected: boolean,
): void => {
  expect(state.canApplicantEstimateConsumptiveUse).toEqual(expected);
};

const shouldReviewerBeAbleToPerformConsumptiveUseEstimate = (
  state: ConservationApplicationState,
  expected: boolean,
): void => {
  expect(state.canReviewerEstimateConsumptiveUse).toEqual(expected);
};

const shouldBeAbleToContinueToApplication = (state: ConservationApplicationState, expected: boolean): void => {
  expect(state.canContinueToApplication).toEqual(expected);
};

describe('ConservationApplicationState reducer', () => {
  let state: ConservationApplicationState;

  beforeEach(() => {
    state = { ...defaultState() };
  });

  it('loading dashboard applications should update state', () => {
    // Arrange
    state.dashboardApplications = [];
    const dashboardApplications: ApplicationDashboardListItem[] = [{ ...mockApplication }];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATIONS_LOADED',
      payload: { dashboardApplications },
    });

    // Assert
    expect(newState.dashboardApplications).toEqual([...dashboardApplications]);
  });

  it('filtering dashboard applications should update state', () => {
    // Arrange
    state.dashboardApplications = [
      { ...mockApplication, applicationId: 'application-guid-1', status: ConservationApplicationStatus.Approved },
      { ...mockApplication, applicationId: 'application-guid-2', status: ConservationApplicationStatus.Denied },
      {
        ...mockApplication,
        applicationId: 'application-guid-3',
        status: ConservationApplicationStatus.InTechnicalReview,
      },
      { ...mockApplication, applicationId: 'application-guid-4', status: ConservationApplicationStatus.Approved },
      {
        ...mockApplication,
        applicationId: 'application-guid-5',
        status: ConservationApplicationStatus.Approved,
        compensationRateUnits: CompensationRateUnits.Acres,
      },
    ];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATION_FILTERS_CHANGED',
      payload: {
        applicationIds: ['application-guid-2', 'application-guid-3', 'application-guid-4', 'application-guid-5'],
      },
    });

    // Assert
    expect(newState.dashboardApplicationsStatistics).toEqual({
      submittedApplications: 4,
      approvedApplications: 2,
      deniedApplications: 1,
      inReviewApplications: 1,
      cumulativeEstimatedSavingsAcreFeet: 300,
      totalObligationDollars: 400,
    });
  });

  it('loading dashboard with zero applications should not error', () => {
    // Arrange
    const dashboardApplications: ApplicationDashboardListItem[] = [];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATIONS_LOADED',
      payload: { dashboardApplications },
    });

    // Assert
    expect(newState.dashboardApplications).toEqual([]);
    expect(newState.dashboardApplicationsStatistics).toEqual({
      submittedApplications: 0,
      approvedApplications: 0,
      deniedApplications: 0,
      inReviewApplications: 0,
      cumulativeEstimatedSavingsAcreFeet: 0,
      totalObligationDollars: 0,
    });
  });

  const mockApplication: ApplicationDashboardListItem = {
    applicantFullName: 'Bobby Hill',
    applicationDisplayId: '2025-ABCD-001',
    applicationId: 'application-guid',
    compensationRateDollars: 100,
    compensationRateUnits: 1,
    organizationName: 'Mock Funding Organization',
    status: ConservationApplicationStatus.Approved,
    submittedDate: new Date('2025-01-01T00:00:00.0000000 +00:00'),
    totalObligationDollars: 200,
    totalWaterVolumeSavingsAcreFeet: 300,
    waterRightNativeId: 'mock-water-right-native-id',
    waterRightState: 'NE',
  };

  it('loading estimation tool page should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'ESTIMATION_TOOL_PAGE_LOADED',
      payload: {
        waterRightNativeId: 'mock-water-right-native-id',
      },
    });

    // Assert
    expect(newState.conservationApplication.waterRightNativeId).toEqual('mock-water-right-native-id');

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('loading funding organization should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'FUNDING_ORGANIZATION_LOADED',
      payload: {
        fundingOrganizationId: 'funding-organization-guid',
        fundingOrganizationName: 'Mock Funding Organization',
        openEtModelName: 'Mock Open ET Model',
        dateRangeStart: new Date(2025, 0, 1),
        dateRangeEnd: new Date(2025, 11, 31),
        compensationRateModel: 'Mock Compensation Rate Model',
      },
    });

    // Assert
    expect(newState.conservationApplication.fundingOrganizationId).toEqual('funding-organization-guid');
    expect(newState.conservationApplication.fundingOrganizationName).toEqual('Mock Funding Organization');
    expect(newState.conservationApplication.openEtModelName).toEqual('Mock Open ET Model');
    expect(newState.conservationApplication.dateRangeStart).toEqual(new Date(2025, 0, 1));
    expect(newState.conservationApplication.dateRangeEnd).toEqual(new Date(2025, 11, 31));
    expect(newState.conservationApplication.compensationRateModel).toEqual('Mock Compensation Rate Model');

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('creating an application should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'APPLICATION_CREATED',
      payload: {
        waterConservationApplicationId: 'application-guid',
        waterConservationApplicationDisplayId: 'display-id',
      },
    });

    // Assert
    expect(newState.conservationApplication.waterConservationApplicationId).toEqual('application-guid');
    expect(newState.conservationApplication.waterConservationApplicationDisplayId).toEqual('display-id');

    expect(newState.isCreatingApplication).toBe(true);

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('applicant updating map polygons should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: [
          {
            polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
            drawToolType: DrawToolType.Freeform,
            acreage: 1,
          },
        ],
        doPolygonsOverlap: true,
      },
    });

    // Assert
    expect(newState.conservationApplication.estimateLocations.length).toEqual(1);
    expect(newState.conservationApplication.estimateLocations[0].polygonWkt).toEqual(
      'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
    );
    expect(newState.conservationApplication.estimateLocations[0].drawToolType).toEqual(DrawToolType.Freeform);
    expect(newState.conservationApplication.estimateLocations[0].acreage).toEqual(1);
    expect(newState.conservationApplication.doPolygonsOverlap).toEqual(true);

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('updating estimation form should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'ESTIMATION_FORM_UPDATED',
      payload: {
        desiredCompensationDollars: 100,
        desiredCompensationUnits: CompensationRateUnits.AcreFeet,
      },
    });

    // Assert
    expect(newState.conservationApplication.desiredCompensationDollars).toEqual(100);
    expect(newState.conservationApplication.desiredCompensationUnits).toEqual(CompensationRateUnits.AcreFeet);

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('applicant estimating consumptive use should update state', () => {
    // Arrange

    // this action's handler has a side effect which requires map polygons to be present
    const polygonWkt = 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))';
    let newState = reducer(state, {
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: [
          {
            polygonWkt,
            drawToolType: DrawToolType.Freeform,
            acreage: 1,
          },
        ],
        doPolygonsOverlap: true,
      },
    });

    // Act
    newState = reducer(newState, {
      type: 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED',
      payload: {
        cumulativeTotalEtInAcreFeet: 100,
        conservationPayment: 200,
        dataCollections: [
          {
            waterConservationApplicationEstimateLocationId: 'location-guid',
            polygonWkt: polygonWkt,
            averageYearlyTotalEtInAcreFeet: 50,
            averageYearlyTotalEtInInches: 400,
            averageYearlyNetEtInInches: null,
            averageYearlyNetEtInAcreFeet: null,
            datapoints: [
              {
                year: 2025,
                totalEtInInches: 400,
                effectivePrecipitationInInches: null,
                netEtInInches: null,
              },
            ],
          },
        ],
      },
    });

    // Assert
    expect(newState.conservationApplication.cumulativeTotalEtInAcreFeet).toEqual(100);
    expect(newState.conservationApplication.conservationPayment).toEqual(200);
    expect(newState.conservationApplication.estimateLocations.length).toEqual(1);
    expect(newState.conservationApplication.estimateLocations[0].datapoints!.length).toEqual(1);
    expect(newState.conservationApplication.estimateLocations[0].fieldName).toEqual('Field 1');

    shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('updating the application form should update state', () => {
    // Arrange
    // Act
    const newState = reducer(state, {
      type: 'APPLICATION_SUBMISSION_FORM_UPDATED',
      payload: {
        formValues: {
          ...defaultApplicationSubmissionFormData(),
          landownerName: 'Bobby Hill',
        },
      },
    });

    // Assert
    const form = newState.conservationApplication.applicationSubmissionForm;
    expect(form.landownerName).toEqual('Bobby Hill');
    expect(newState.conservationApplication.isDirty).toBe(true);
  });

  it('saving application submission updates should update dirty flag in state', () => {
    // Arrange
    state.conservationApplication.isDirty = true;

    // Act
    const newState = reducer(state, {
      type: 'APPLICATION_SAVED',
    });

    // Assert
    expect(newState.conservationApplication.isDirty).toBe(false);
  });

  it('uploading documents should update state', () => {
    // Arrange
    const uploadedDocument: ApplicationDocument = {
      fileName: 'document_1.docx',
      blobName: 'my-blob-guid',
      description: 'Description for supporting documents entered by the user',
    };

    // Act
    const newState = reducer(state, {
      type: 'APPLICATION_DOCUMENT_UPLOADED',
      payload: { uploadedDocuments: [uploadedDocument] },
    });

    // Assert
    expect(newState.conservationApplication.supportingDocuments.length).toEqual(1);
    expect(newState.conservationApplication.supportingDocuments[0].fileName).toEqual(uploadedDocument.fileName);
    expect(newState.conservationApplication.supportingDocuments[0].blobName).toEqual(uploadedDocument.blobName);
    expect(newState.conservationApplication.supportingDocuments[0].description).toEqual(uploadedDocument.description);
    expect(newState.conservationApplication.isDirty).toBe(true);
  });

  it('removing an existing document should update state', () => {
    // Arrange
    const existingDocument: ApplicationDocument = {
      fileName: 'document_1.docx',
      blobName: 'my-blob-guid',
      description: 'Description for supporting documents entered by the user',
    };
    const anotherDocument: ApplicationDocument = {
      fileName: 'document_2.docx',
      blobName: 'my-blob-guid-2',
      description: 'Description for a different supporting document',
    };
    state.conservationApplication.supportingDocuments = [existingDocument, anotherDocument];

    // Act
    const newState = reducer(state, {
      type: 'APPLICATION_DOCUMENT_REMOVED',
      payload: { removedBlobName: existingDocument.blobName },
    });

    // Assert
    expect(newState.conservationApplication.supportingDocuments.length).toEqual(1);
    expect(newState.conservationApplication.supportingDocuments[0].fileName).toEqual(anotherDocument.fileName);
    expect(newState.conservationApplication.supportingDocuments[0].blobName).toEqual(anotherDocument.blobName);
    expect(newState.conservationApplication.supportingDocuments[0].description).toEqual(anotherDocument.description);
    expect(newState.conservationApplication.isDirty).toBe(true);
  });

  it('setting document upload status should update state', () => {
    let newState = reducer(state, {
      type: 'APPLICATION_DOCUMENT_UPLOADING',
      payload: {
        isUploadingDocument: true,
      },
    });
    expect(newState.isUploadingDocument).toBe(true);

    newState = reducer(newState, {
      type: 'APPLICATION_DOCUMENT_UPLOADING',
      payload: {
        isUploadingDocument: false,
      },
    });
    expect(newState.isUploadingDocument).toBe(false);
  });

  describe('Estimation Tool Page Use Cases', () => {
    it('estimate consumptive use should be disabled when no data is present', () => {
      // Arrange
      // Act
      // Assert
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(state, false);
      shouldReviewerBeAbleToPerformConsumptiveUseEstimate(state, false);
    });

    it('estimate consumptive use should be disabled when more than the maximum number of polygons have been selected', () => {
      // Arrange
      // Act
      let newState = reducer(state, {
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: 'mock-water-right-native-id',
        },
      });

      newState = reducer(newState, {
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: 'funding-organization-guid',
          fundingOrganizationName: 'Mock Funding Organization',
          openEtModelName: 'Mock Open ET Model',
          dateRangeStart: new Date(2025, 0, 1),
          dateRangeEnd: new Date(2025, 11, 31),
          compensationRateModel: 'Mock Compensation Rate Model',
        },
      });

      newState = reducer(newState, {
        type: 'APPLICATION_CREATED',
        payload: {
          waterConservationApplicationId: 'application-guid',
          waterConservationApplicationDisplayId: 'display-id',
        },
      });

      const polygon: MapSelectionPolygonData = {
        polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
        drawToolType: DrawToolType.Freeform,
        acreage: 1,
      };

      newState = reducer(newState, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: Array.from({ length: 21 }, () => polygon),
          doPolygonsOverlap: false,
        },
      });

      // Assert
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);
      shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);
    });

    it('applicant should be able to estimate consumptive use when at least one map polygon is present', () => {
      // Arrange
      // Act
      let newState = reducer(state, {
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: 'mock-water-right-native-id',
        },
      });

      newState = reducer(newState, {
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: 'funding-organization-guid',
          fundingOrganizationName: 'Mock Funding Organization',
          openEtModelName: 'Mock Open ET Model',
          dateRangeStart: new Date(2025, 0, 1),
          dateRangeEnd: new Date(2025, 11, 31),
          compensationRateModel: 'Mock Compensation Rate Model',
        },
      });

      newState = reducer(newState, {
        type: 'APPLICATION_CREATED',
        payload: {
          waterConservationApplicationId: 'application-guid',
          waterConservationApplicationDisplayId: 'display-id',
        },
      });

      newState = reducer(newState, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: [
            {
              polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
              drawToolType: DrawToolType.Freeform,
              acreage: 1,
            },
          ],
          doPolygonsOverlap: false,
        },
      });

      // Assert
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, true);
    });

    it('applicant should be able to estimate consumptive use depending on the sidebar inputs', () => {
      // Arrange - initialize page, setup map
      let newState = reducer(state, {
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: 'mock-water-right-native-id',
        },
      });

      newState = reducer(newState, {
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: 'funding-organization-guid',
          fundingOrganizationName: 'Mock Funding Organization',
          openEtModelName: 'Mock Open ET Model',
          dateRangeStart: new Date(2025, 0, 1),
          dateRangeEnd: new Date(2025, 11, 31),
          compensationRateModel: 'Mock Compensation Rate Model',
        },
      });

      newState = reducer(newState, {
        type: 'APPLICATION_CREATED',
        payload: {
          waterConservationApplicationId: 'application-guid',
          waterConservationApplicationDisplayId: 'display-id',
        },
      });

      newState = reducer(newState, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: [
            {
              polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
              drawToolType: DrawToolType.Freeform,
              acreage: 1,
            },
          ],
          doPolygonsOverlap: false,
        },
      });

      // Act / Assert
      // estimation form has no data
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, true);

      // estimation form has partial data
      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: 100,
          desiredCompensationUnits: undefined,
        },
      });
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);

      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: undefined,
          desiredCompensationUnits: CompensationRateUnits.AcreFeet,
        },
      });
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, false);

      // estimation form has all data
      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: 100,
          desiredCompensationUnits: CompensationRateUnits.AcreFeet,
        },
      });
      shouldApplicantBeAbleToPerformConsumptiveUseEstimate(newState, true);
    });

    it('continuing to application should be disabled when no data is present', () => {
      // Arrange
      // Act
      // Assert
      shouldBeAbleToContinueToApplication(state, false);
    });

    it('continuing to application should be enabled when all required data is present', () => {
      // Arrange
      // Act
      let newState = reducer(state, {
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: 'mock-water-right-native-id',
        },
      });

      newState = reducer(newState, {
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: 'funding-organization-guid',
          fundingOrganizationName: 'Mock Funding Organization',
          openEtModelName: 'Mock Open ET Model',
          dateRangeStart: new Date(2025, 0, 1),
          dateRangeEnd: new Date(2025, 11, 31),
          compensationRateModel: 'Mock Compensation Rate Model',
        },
      });

      newState = reducer(newState, {
        type: 'APPLICATION_CREATED',
        payload: {
          waterConservationApplicationId: 'application-guid',
          waterConservationApplicationDisplayId: 'display-id',
        },
      });

      newState = reducer(newState, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: [
            {
              polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
              drawToolType: DrawToolType.Freeform,
              acreage: 1,
            },
          ],
          doPolygonsOverlap: false,
        },
      });

      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: 100,
          desiredCompensationUnits: CompensationRateUnits.AcreFeet,
        },
      });

      newState = reducer(newState, {
        type: 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED',
        payload: {
          cumulativeTotalEtInAcreFeet: 100,
          conservationPayment: 200,
          dataCollections: [
            {
              waterConservationApplicationEstimateLocationId: 'location-guid',
              polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
              averageYearlyTotalEtInAcreFeet: 50,
              averageYearlyTotalEtInInches: 400,
              averageYearlyNetEtInInches: null,
              averageYearlyNetEtInAcreFeet: null,
              datapoints: [
                {
                  year: 2025,
                  totalEtInInches: 400,
                  effectivePrecipitationInInches: null,
                  netEtInInches: null,
                },
              ],
            },
          ],
        },
      });

      // Assert
      shouldBeAbleToContinueToApplication(newState, true);
    });
  });

  describe('Review Page Use Cases', () => {
    let applicationDetails: ApplicationDetails;
    let applicationReviewNote: ApplicationReviewNote;

    beforeEach(() => {
      applicationDetails = applicationDetailsMock();
      applicationReviewNote = {
        id: 'note-guid',
        submittedDate: '2025-01-01T00:00:00.0000000 +00:00',
        submittedByUserId: 'user-guid',
        submittedByFullName: 'first last',
        note: 'This is a note from a reviewer.',
      };
    });

    it('loading application should hydrate state', () => {
      // Arrange
      // Act
      const newState = reducer(state, {
        type: 'APPLICATION_LOADED',
        payload: {
          application: applicationDetails,
          notes: [applicationReviewNote],
          reviewPipeline: {
            reviewSteps: [
              {
                reviewStepType: ReviewStepType.Approval,
                reviewStepStatus: ReviewStepStatus.Approved,
                participantName: 'Reviewer 1',
                reviewDate: '2025-01-01T00:00:00.0000000 +00:00',
              },
            ],
          },
        },
      });

      // Assert
      const application = newState.conservationApplication;

      // application
      expect(application.waterConservationApplicationId).toEqual(applicationDetails.id);
      expect(application.waterRightNativeId).toEqual(applicationDetails.waterRightNativeId);
      expect(application.fundingOrganizationId).toEqual(applicationDetails.fundingOrganizationId);

      // application estimate
      expect(application.desiredCompensationDollars).toEqual(applicationDetails.estimate.compensationRateDollars);
      expect(application.desiredCompensationUnits).toEqual(applicationDetails.estimate.compensationRateUnits);
      expect(application.cumulativeTotalEtInAcreFeet).toEqual(applicationDetails.estimate.cumulativeTotalEtInAcreFeet);
      expect(application.conservationPayment).toEqual(applicationDetails.estimate.estimatedCompensationDollars);

      // application estimate locations
      const location = application.estimateLocations[0];
      const expectedLocation = applicationDetails.estimate.locations[0];
      expect(application.estimateLocations.length).toEqual(applicationDetails.estimate.locations.length);
      expect(location.waterConservationApplicationEstimateLocationId).toEqual(expectedLocation.id);
      expect(location.polygonWkt).toEqual(expectedLocation.polygonWkt);
      expect(location.drawToolType).toEqual(expectedLocation.drawToolType);
      expect(location.acreage).toEqual(expectedLocation.polygonAreaInAcres);
      expect(location.fieldName).toEqual('Field 1');
      expect(location.additionalDetails).toEqual(expectedLocation.additionalDetails);

      // application estimate location water measurements
      const consumptiveUse = location.datapoints![0];
      const expectedConsumptiveUse = expectedLocation.waterMeasurements[0];
      expect(location.datapoints!.length).toEqual(expectedLocation.waterMeasurements.length);
      expect(consumptiveUse.year).toEqual(expectedConsumptiveUse.year);
      expect(consumptiveUse.totalEtInInches).toEqual(expectedConsumptiveUse.totalEtInInches);

      // application estimate control location
      const controlLocation = application.controlLocation!;
      const expectedControlLocation = applicationDetails.estimate.controlLocation;
      expect(controlLocation.waterConservationApplicationEstimateControlLocationId).toBe(expectedControlLocation!.id);
      expect(controlLocation.pointWkt).toEqual(expectedControlLocation!.pointWkt);
      expect(controlLocation.datapoints!.length).toBe(expectedControlLocation!.waterMeasurements.length);
      expect(newState.controlPointLocationHasBeenSaved).toBe(true);

      // application estimate control location water measurements
      const controlLocationWaterMeasurement = controlLocation.datapoints![0];
      const expectedControlLocationWaterMeasurement = expectedControlLocation!.waterMeasurements[0];
      expect(controlLocationWaterMeasurement.year).toEqual(expectedControlLocationWaterMeasurement.year);
      expect(controlLocationWaterMeasurement.totalEtInInches).toEqual(
        expectedControlLocationWaterMeasurement.totalEtInInches,
      );
      expect(controlLocationWaterMeasurement.effectivePrecipitationInInches).toEqual(null);
      expect(controlLocationWaterMeasurement.netEtInInches).toEqual(null);

      // application supporting documents
      const document = application.supportingDocuments[0];
      const expectedDocument = applicationDetails.supportingDocuments[0];
      expect(application.supportingDocuments.length).toEqual(applicationDetails.supportingDocuments.length);
      expect(document.id).toEqual(expectedDocument.id);
      expect(document.fileName).toEqual(expectedDocument.fileName);
      expect(document.blobName).toEqual(expectedDocument.blobName);
      expect(document.description).toEqual(expectedDocument.description);

      // application notes
      const applicationNote = application.reviewerNotes[0];
      expect(applicationNote.id).toEqual(applicationReviewNote.id);
      expect(applicationNote.submittedByFullName).toEqual(applicationReviewNote.submittedByFullName);
      expect(applicationNote.submittedDate).toEqual(applicationReviewNote.submittedDate);
      expect(applicationNote.note).toEqual(applicationReviewNote.note);

      // application submission
      const submission = application.applicationSubmissionForm;
      const expectedSubmission = applicationDetails.submission;
      expect(submission.agentName).toEqual(expectedSubmission.agentName);
      expect(submission.agentEmail).toEqual(expectedSubmission.agentEmail);
      expect(submission.agentPhoneNumber).toEqual(expectedSubmission.agentPhoneNumber);
      expect(submission.agentAdditionalDetails).toEqual(expectedSubmission.agentAdditionalDetails);

      expect(submission.landownerName).toEqual(expectedSubmission.landownerName);
      expect(submission.landownerEmail).toEqual(expectedSubmission.landownerEmail);
      expect(submission.landownerPhoneNumber).toEqual(expectedSubmission.landownerPhoneNumber);
      expect(submission.landownerAddress).toEqual(expectedSubmission.landownerAddress);
      expect(submission.landownerCity).toEqual(expectedSubmission.landownerCity);
      expect(submission.landownerState).toEqual(expectedSubmission.landownerState);
      expect(submission.landownerZipCode).toEqual(expectedSubmission.landownerZipCode);

      expect(submission.canalOrIrrigationEntityName).toEqual(expectedSubmission.canalOrIrrigationEntityName);
      expect(submission.canalOrIrrigationEntityEmail).toEqual(expectedSubmission.canalOrIrrigationEntityEmail);
      expect(submission.canalOrIrrigationEntityPhoneNumber).toEqual(
        expectedSubmission.canalOrIrrigationEntityPhoneNumber,
      );
      expect(submission.canalOrIrrigationAdditionalDetails).toEqual(
        expectedSubmission.canalOrIrrigationAdditionalDetails,
      );

      expect(submission.conservationPlanFundingRequestDollarAmount).toEqual(
        expectedSubmission.conservationPlanFundingRequestDollarAmount,
      );
      expect(submission.conservationPlanFundingRequestCompensationRateUnits).toEqual(
        expectedSubmission.conservationPlanFundingRequestCompensationRateUnits,
      );
      expect(submission.conservationPlanDescription).toEqual(expectedSubmission.conservationPlanDescription);
      expect(submission.conservationPlanAdditionalInfo).toEqual(expectedSubmission.conservationPlanAdditionalInfo);

      expect(submission.estimationSupplementaryDetails).toEqual(expectedSubmission.estimationSupplementaryDetails);

      expect(submission.permitNumber).toEqual(expectedSubmission.permitNumber);
      expect(submission.facilityDitchName).toEqual(expectedSubmission.facilityDitchName);
      expect(submission.priorityDate).toEqual(expectedSubmission.priorityDate);
      expect(submission.certificateNumber).toEqual(expectedSubmission.certificateNumber);
      expect(submission.shareNumber).toEqual(expectedSubmission.shareNumber);
      expect(submission.waterRightState).toEqual(expectedSubmission.waterRightState);
      expect(submission.waterUseDescription).toEqual(expectedSubmission.waterUseDescription);

      // application dirty status
      expect(newState.conservationApplication.isDirty).toBe(false);

      // data table should be hidden
      expect(newState.displayDataTable).toBe(false);
    });

    it('loading multiple applications should modify control location state', () => {
      // Arrange
      // first application - has control location
      const applicationLoadedAction1: ApplicationLoadedAction = {
        type: 'APPLICATION_LOADED',
        payload: {
          application: applicationDetails,
          notes: [applicationReviewNote],
          reviewPipeline: {
            reviewSteps: [
              {
                reviewStepType: ReviewStepType.Approval,
                reviewStepStatus: ReviewStepStatus.Approved,
                participantName: 'Reviewer 1',
                reviewDate: '2025-01-01T00:00:00.0000000 +00:00',
              },
            ],
          },
        },
      };

      // second application - has no control location
      const applicationLoadedAction2: ApplicationLoadedAction = {
        type: 'APPLICATION_LOADED',
        payload: {
          application: {
            ...applicationDetails,
            estimate: {
              ...applicationDetails.estimate,
              controlLocation: null,
            },
          },
          notes: [applicationReviewNote],
          reviewPipeline: {
            reviewSteps: [
              {
                reviewStepType: ReviewStepType.Approval,
                reviewStepStatus: ReviewStepStatus.Approved,
                participantName: 'Reviewer 1',
                reviewDate: '2025-01-01T00:00:00.0000000 +00:00',
              },
            ],
          },
        },
      };

      // Act 1
      let newState = reducer(state, applicationLoadedAction1);

      // Assert 1
      expect(newState.conservationApplication.controlLocation).toBeDefined();
      expect(newState.controlPointLocationHasBeenSaved).toBe(true);

      // Act 2
      newState = reducer(newState, applicationLoadedAction2);

      // Assert 2
      expect(newState.conservationApplication.controlLocation).toBeUndefined();
      expect(newState.controlPointLocationHasBeenSaved).toBe(false);
    });

    it('reviewer updating map data should update state', () => {
      // Arrange
      // hydrate state
      let newState = reducer(state, {
        type: 'APPLICATION_LOADED',
        payload: {
          application: applicationDetails,
          notes: [applicationReviewNote],
          reviewPipeline: {
            reviewSteps: [],
          },
        },
      });

      // verify polygon exists in state
      expect(newState.conservationApplication.estimateLocations.length).toEqual(1);
      expect(newState.conservationApplication.estimateLocations[0].waterConservationApplicationEstimateLocationId).toBe(
        'location-guid',
      );

      // verify control location exists in state
      expect(newState.conservationApplication.controlLocation).toBeDefined();
      expect(
        newState.conservationApplication.controlLocation?.waterConservationApplicationEstimateControlLocationId,
      ).toBe('control-location-guid');
      expect(newState.conservationApplication.controlLocation?.pointWkt).toBeTruthy();

      // verify consumptive use data is defined in state
      expect(newState.conservationApplication.cumulativeTotalEtInAcreFeet).toBeDefined();
      expect(newState.conservationApplication.cumulativeNetEtInAcreFeet).toBeDefined();
      expect(newState.conservationApplication.conservationPayment).toBeDefined();

      // Act 1 - update existing polygon
      const movePolygonAction: ReviewerMapDataUpdatedAction = {
        type: 'REVIEWER_MAP_DATA_UPDATED',
        payload: {
          polygons: [
            {
              // this polygon has the same id as the existing polygon but a different wkt
              waterConservationApplicationEstimateLocationId: 'location-guid',
              polygonWkt: 'POLYGON ((2 2, 2 3, 3 3, 3 2, 2 2))',
              drawToolType: DrawToolType.Freeform,
              acreage: 1,
            },
          ],
          doPolygonsOverlap: false,
          controlLocation: {
            pointWkt: 'POINT (1 1)',
          },
          doesControlLocationOverlapWithPolygons: false,
        },
      };
      newState = reducer(state, movePolygonAction);

      // Assert 1
      // polygon should be updated
      expect(newState.conservationApplication.estimateLocations.length).toEqual(1);
      const location = newState.conservationApplication.estimateLocations[0];
      const payloadLocation = movePolygonAction.payload.polygons[0];

      expect(location.waterConservationApplicationEstimateLocationId).toBe(
        payloadLocation.waterConservationApplicationEstimateLocationId,
      );
      expect(location.polygonWkt).toEqual(payloadLocation.polygonWkt);
      expect(location.drawToolType).toEqual(payloadLocation.drawToolType);
      expect(location.acreage).toEqual(payloadLocation.acreage);
      expect(newState.conservationApplication.doPolygonsOverlap).toEqual(false);

      // side effect - consumptive use data should be reset for the estimate, the location(s), and the control location
      expect(newState.conservationApplication.cumulativeTotalEtInAcreFeet).toBe(undefined);
      expect(newState.conservationApplication.cumulativeNetEtInAcreFeet).toBe(undefined);
      expect(newState.conservationApplication.conservationPayment).toBe(undefined);
      expect(location.averageYearlyTotalEtInInches).toBe(undefined);
      expect(location.datapoints).toEqual([]);
      expect(newState.conservationApplication.controlLocation?.datapoints).toEqual([]);
      expect(newState.conservationApplication.controlLocation?.averageYearlyTotalEtInInches).toBe(undefined);

      // Act 2 - add new polygon
      const addPolygonAction: ReviewerMapDataUpdatedAction = {
        type: 'REVIEWER_MAP_DATA_UPDATED',
        payload: {
          polygons: [
            // preserve existing polygon
            ...movePolygonAction.payload.polygons,
            // add new polygon
            {
              // newly drawn polygon, no Id provided
              polygonWkt: 'POLYGON ((4 4, 4 5, 5 5, 5 4, 4 4))',
              drawToolType: DrawToolType.Rectangle,
              acreage: 3,
            },
          ],
          doPolygonsOverlap: false,
          // ignore control location - keep as is
          controlLocation: movePolygonAction.payload.controlLocation,
          doesControlLocationOverlapWithPolygons: false,
        },
      };

      newState = reducer(newState, addPolygonAction);

      // Assert 2
      expect(newState.conservationApplication.estimateLocations.length).toEqual(2);
      expect(newState.conservationApplication.estimateLocations[1].waterConservationApplicationEstimateLocationId).toBe(
        undefined,
      );
      expect(newState.conservationApplication.estimateLocations[1].polygonWkt).toBe(
        addPolygonAction.payload.polygons[1].polygonWkt,
      );

      // Act 3 - remove polygon
      const removePolygonAction: ReviewerMapDataUpdatedAction = {
        type: 'REVIEWER_MAP_DATA_UPDATED',
        payload: {
          polygons: [
            // preserve first polygon
            ...movePolygonAction.payload.polygons,
            // second polygon is removed
          ],
          doPolygonsOverlap: false,
          // ignore control location - keep as is
          controlLocation: movePolygonAction.payload.controlLocation,
          doesControlLocationOverlapWithPolygons: false,
        },
      };

      newState = reducer(newState, removePolygonAction);

      // Assert 3
      expect(newState.conservationApplication.estimateLocations.length).toEqual(1);

      // existing polygon remains - should retain Id and wkt
      const remainingLocation = newState.conservationApplication.estimateLocations[0];
      const remainingPayloadLocation = removePolygonAction.payload.polygons[0];

      expect(remainingLocation.waterConservationApplicationEstimateLocationId).toBe(
        remainingPayloadLocation.waterConservationApplicationEstimateLocationId,
      );
      expect(remainingLocation.polygonWkt).toBe(remainingPayloadLocation.polygonWkt);

      // Act 4 - update control location
      const updateControlLocationAction: ReviewerMapDataUpdatedAction = {
        type: 'REVIEWER_MAP_DATA_UPDATED',
        payload: {
          polygons: [
            // no change to polygons relative to the last update
            ...removePolygonAction.payload.polygons,
          ],
          doPolygonsOverlap: false,
          // control location changed
          controlLocation: {
            pointWkt: 'POINT (5 5)',
          },
          doesControlLocationOverlapWithPolygons: false,
        },
      };

      newState = reducer(newState, updateControlLocationAction);

      // Assert 4
      const initialControlLocation = newState.conservationApplication.controlLocation;
      const controlLocation = newState.conservationApplication.controlLocation;
      const controlLocationPayload = updateControlLocationAction.payload.controlLocation;

      // id should be preserved if it exists
      expect(controlLocation?.waterConservationApplicationEstimateControlLocationId).toBe(
        initialControlLocation?.waterConservationApplicationEstimateControlLocationId,
      );
      // wkt should be updated
      expect(controlLocation?.pointWkt).toBe(controlLocationPayload?.pointWkt);

      // unavoidable data loss
      expect(controlLocation?.averageYearlyTotalEtInInches).toBe(undefined);
      expect(controlLocation?.datapoints).toEqual([]);
    });
  });

  it('reviewer should be able to estimate consumptive use once control location is present', () => {
    // Arrange
    let newState = reducer(state, {
      type: 'APPLICATION_LOADED',
      payload: {
        application: applicationDetailsMock(),
        notes: [],
        reviewPipeline: {
          reviewSteps: [],
        },
      },
    });
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, false);

    // Act
    newState = reducer(newState, {
      type: 'REVIEWER_MAP_DATA_UPDATED',
      payload: {
        // polygons remain as-is
        polygons: newState.conservationApplication.estimateLocations.map(
          (polygon): MapSelectionPolygonData => ({
            waterConservationApplicationEstimateLocationId: polygon.waterConservationApplicationEstimateLocationId,
            polygonWkt: polygon.polygonWkt!,
            acreage: polygon.acreage!,
            drawToolType: polygon.drawToolType!,
          }),
        ),
        doPolygonsOverlap: false,
        // new control location
        controlLocation: {
          pointWkt: 'POINT (5 5)',
        },
        doesControlLocationOverlapWithPolygons: false,
      },
    });

    // Assert
    shouldReviewerBeAbleToPerformConsumptiveUseEstimate(newState, true);
  });

  it('reviewer estimating consumptive use should update state', () => {
    // Arrange
    const applicationLoadedAction: ApplicationLoadedAction = {
      type: 'APPLICATION_LOADED',
      payload: {
        application: applicationDetailsMock(),
        notes: [],
        reviewPipeline: {
          reviewSteps: [],
        },
      },
    };
    let newState = reducer(state, applicationLoadedAction);

    // user selects valid control location
    const polygon = newState.conservationApplication.estimateLocations[0];
    const addControlLocationAction: ReviewerMapDataUpdatedAction = {
      type: 'REVIEWER_MAP_DATA_UPDATED',
      payload: {
        polygons: [
          // polygons remain as-is
          ...[polygon].map(
            (polygon): MapSelectionPolygonData => ({
              waterConservationApplicationEstimateLocationId: polygon.waterConservationApplicationEstimateLocationId,
              polygonWkt: polygon.polygonWkt!,
              acreage: polygon.acreage!,
              drawToolType: polygon.drawToolType!,
            }),
          ),
        ],
        doPolygonsOverlap: false,
        controlLocation: {
          pointWkt: 'POINT (5 5)',
        },
        doesControlLocationOverlapWithPolygons: false,
      },
    };
    newState = reducer(newState, addControlLocationAction);

    expect(newState.conservationApplication.controlLocation).toBeDefined();
    expect(newState.controlPointLocationHasBeenSaved).toBe(true);

    // Act
    const estimateConsumptiveUseAction: ReviewerConsumptiveUseEstimatedAction = {
      type: 'REVIEWER_CONSUMPTIVE_USE_ESTIMATED',
      payload: {
        cumulativeTotalEtInAcreFeet: 200,
        cumulativeNetEtInAcreFeet: 100,
        conservationPayment: 50_000,
        dataCollections: [
          {
            waterConservationApplicationEstimateLocationId: polygon.waterConservationApplicationEstimateLocationId!,
            polygonWkt: polygon.polygonWkt!,
            averageYearlyTotalEtInInches: 12,
            averageYearlyTotalEtInAcreFeet: 120,
            averageYearlyNetEtInInches: 10,
            averageYearlyNetEtInAcreFeet: 100,
            datapoints: [
              {
                totalEtInInches: 12,
                effectivePrecipitationInInches: 2,
                netEtInInches: 10,
                year: 2025,
              },
            ],
          },
        ],
        controlDataCollection: {
          waterConservationApplicationEstimateControlLocationId: 'control-location-guid',
          pointWkt: addControlLocationAction.payload.controlLocation!.pointWkt,
          averageYearlyTotalEtInInches: 2,
          datapoints: [
            {
              totalEtInInches: 2,
              year: 2025,
              effectivePrecipitationInInches: null,
              netEtInInches: null,
            },
          ],
        },
        estimateWasSaved: false,
      },
    };
    newState = reducer(newState, estimateConsumptiveUseAction);

    // Assert
    // application should be updated
    const application = newState.conservationApplication;
    const payload = estimateConsumptiveUseAction.payload;

    expect(application.cumulativeTotalEtInAcreFeet).toEqual(payload.cumulativeTotalEtInAcreFeet);
    expect(application.cumulativeNetEtInAcreFeet).toEqual(payload.cumulativeNetEtInAcreFeet);
    expect(application.conservationPayment).toEqual(payload.conservationPayment);

    // locations should be updated:
    // * existing details should be preserved
    // * consumptive use data should be added
    expect(application.estimateLocations.length).toEqual(1);
    const location = application.estimateLocations[0];
    const locationPayload = payload.dataCollections[0];

    expect(location.waterConservationApplicationEstimateLocationId).toEqual(
      locationPayload.waterConservationApplicationEstimateLocationId,
    );
    expect(location.polygonWkt).toEqual(locationPayload.polygonWkt);

    expect(location.averageYearlyTotalEtInInches).toEqual(locationPayload.averageYearlyTotalEtInInches);
    expect(location.averageYearlyTotalEtInAcreFeet).toEqual(locationPayload.averageYearlyTotalEtInAcreFeet);
    expect(location.averageYearlyNetEtInInches).toEqual(locationPayload.averageYearlyNetEtInInches);
    expect(location.averageYearlyNetEtInAcreFeet).toEqual(locationPayload.averageYearlyNetEtInAcreFeet);
    expect(location.datapoints).toEqual(locationPayload.datapoints);

    // control location should be updated
    const controlLocation = application.controlLocation;
    const controlLocationPayload = payload.controlDataCollection;

    expect(controlLocation?.waterConservationApplicationEstimateControlLocationId).toEqual(
      controlLocationPayload.waterConservationApplicationEstimateControlLocationId,
    );
    expect(controlLocation?.pointWkt).toEqual(controlLocationPayload.pointWkt);
    expect(controlLocation?.averageYearlyTotalEtInInches).toEqual(controlLocationPayload.averageYearlyTotalEtInInches);
    expect(controlLocation?.datapoints).toEqual(controlLocationPayload.datapoints);
    expect(newState.controlPointLocationHasBeenSaved).toEqual(true);
  });

  it('reviewer modified polygons and saved changes - polygons and Application Submission form should be updated', () => {
    // Arrange
    // reviewer loads application with existing polygons
    const applicationMock = applicationDetailsMock();
    const applicationLoadedAction: ApplicationLoadedAction = {
      type: 'APPLICATION_LOADED',
      payload: {
        application: {
          ...applicationMock,
          estimate: {
            ...applicationMock.estimate,
            locations: [
              {
                id: 'polygon-1',
                additionalDetails: 'field 1 details',
                polygonWkt: 'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))',
                drawToolType: DrawToolType.Freeform,
                polygonAreaInAcres: 10,
                averageYearlyTotalEtInInches: 12,
                averageYearlyTotalEtInAcreFeet: 1,
                averageYearlyNetEtInInches: null,
                averageYearlyNetEtInAcreFeet: null,
                waterMeasurements: [],
              },
              {
                id: 'polygon-2',
                additionalDetails: 'field 2 details',
                polygonWkt: 'POLYGON ((0 0, 2 0, 2 2, 0 2, 0 0))',
                drawToolType: DrawToolType.Freeform,
                polygonAreaInAcres: 20,
                averageYearlyTotalEtInInches: 12,
                averageYearlyTotalEtInAcreFeet: 1,
                averageYearlyNetEtInInches: null,
                averageYearlyNetEtInAcreFeet: null,
                waterMeasurements: [],
              },
              {
                id: 'polygon-3',
                additionalDetails: 'field 3 details',
                polygonWkt: 'POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0))',
                drawToolType: DrawToolType.Freeform,
                polygonAreaInAcres: 30,
                averageYearlyTotalEtInInches: 12,
                averageYearlyTotalEtInAcreFeet: 1,
                averageYearlyNetEtInInches: null,
                averageYearlyNetEtInAcreFeet: null,
                waterMeasurements: [],
              },
            ],
            // control location comes from mock
          },
        },
        notes: [],
        reviewPipeline: {
          reviewSteps: [],
        },
      },
    };

    let newState = reducer(state, applicationLoadedAction);

    // sanity check - polygons should exist in conservation application state;
    // application submission form should have an entry for each polygon
    expect(newState.conservationApplication.estimateLocations.length).toEqual(3);
    expect(newState.conservationApplication.applicationSubmissionForm.fieldDetails.length).toEqual(3);

    // Act / Assert
    // user deletes polygon 2
    const updateMapDataAction: ReviewerMapDataUpdatedAction = {
      type: 'REVIEWER_MAP_DATA_UPDATED',
      payload: {
        polygons: [
          // preserve polygons 1 and 3; polygon 2 not included
          {
            waterConservationApplicationEstimateLocationId: 'polygon-1',
            polygonWkt: 'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))',
            drawToolType: DrawToolType.Freeform,
            acreage: 10,
          },
          {
            waterConservationApplicationEstimateLocationId: 'polygon-3',
            polygonWkt: 'POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0))',
            drawToolType: DrawToolType.Freeform,
            acreage: 30,
          },
        ],
        doPolygonsOverlap: false,
        // no change to control location
        controlLocation: {
          pointWkt: newState.conservationApplication.controlLocation!.pointWkt!,
        },
        doesControlLocationOverlapWithPolygons: false,
      },
    };
    newState = reducer(newState, updateMapDataAction);

    // verify submission form was updated
    const fieldDetails = () => newState.conservationApplication.applicationSubmissionForm.fieldDetails;

    expect(fieldDetails().length).toEqual(2);

    expect(fieldDetails()[0].waterConservationApplicationEstimateLocationId).toEqual('polygon-1');
    expect(fieldDetails()[0].additionalDetails).toEqual('field 1 details');
    expect(fieldDetails()[1].waterConservationApplicationEstimateLocationId).toEqual('polygon-3');
    expect(fieldDetails()[1].additionalDetails).toEqual('field 3 details');

    // user adds new polygon
    const updateMapDataAction2: ReviewerMapDataUpdatedAction = {
      type: 'REVIEWER_MAP_DATA_UPDATED',
      payload: {
        ...updateMapDataAction.payload,
        polygons: [
          // preserve polygons 1 and 3
          ...updateMapDataAction.payload.polygons,
          // add new polygon
          {
            waterConservationApplicationEstimateLocationId: undefined,
            polygonWkt: 'POLYGON ((0 0, 4 0, 4 4, 0 4, 0 0))',
            drawToolType: DrawToolType.Rectangle,
            acreage: 40,
          },
        ],
      },
    };
    newState = reducer(newState, updateMapDataAction2);

    // verify submission form was *not* updated
    expect(fieldDetails().length).toEqual(2);

    expect(fieldDetails()[0].waterConservationApplicationEstimateLocationId).toEqual('polygon-1');
    expect(fieldDetails()[0].additionalDetails).toEqual('field 1 details');
    expect(fieldDetails()[1].waterConservationApplicationEstimateLocationId).toEqual('polygon-3');
    expect(fieldDetails()[1].additionalDetails).toEqual('field 3 details');
    // no new entry for new polygon:
    // it isn't saved yet / it has no id,
    // therefore the reviewer shouldn't be able to enter the Additional Details for it yet

    const consumptiveUseEstimatedAction: ReviewerConsumptiveUseEstimatedAction = {
      type: 'REVIEWER_CONSUMPTIVE_USE_ESTIMATED',
      payload: {
        cumulativeTotalEtInAcreFeet: 200,
        cumulativeNetEtInAcreFeet: 100,
        conservationPayment: 50_000,
        // polygons in response should match what's already in state
        dataCollections: newState.conservationApplication.estimateLocations.map(
          (location): PolygonEtDataCollection => ({
            waterConservationApplicationEstimateLocationId:
              location.waterConservationApplicationEstimateLocationId ?? null,
            polygonWkt: location.polygonWkt!,
            averageYearlyTotalEtInInches: 12,
            averageYearlyTotalEtInAcreFeet: 120,
            averageYearlyNetEtInInches: 10,
            averageYearlyNetEtInAcreFeet: 100,
            datapoints: [],
          }),
        ),
        controlDataCollection: {
          waterConservationApplicationEstimateControlLocationId: 'control-location-guid',
          pointWkt: newState.conservationApplication.controlLocation!.pointWkt!,
          averageYearlyTotalEtInInches: 2,
          datapoints: [],
        },
        estimateWasSaved: true,
      },
    };
    newState = reducer(newState, consumptiveUseEstimatedAction);

    // changes were saved to backend - field names should be updated
    const locations = newState.conservationApplication.estimateLocations;
    expect(locations.length).toEqual(3);
    expect(locations[0].fieldName).toEqual('Field 1');
    expect(locations[1].fieldName).toEqual('Field 3');
    expect(locations[2].fieldName).toEqual('Field 4');

    // notably, the submission form won't be updated until the user returns to the form page and the updated form is generated
    expect(fieldDetails().length).toEqual(2);
  });

  describe('Additional Use Cases', () => {
    it("should reset the Application Submission form's polygons' AdditionalDetails fields if the applicant updates their polygon selections.", () => {
      // user selects map polygons
      const polygonWkt = 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))';
      let newState = reducer(state, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: [
            {
              polygonWkt,
              drawToolType: DrawToolType.Freeform,
              acreage: 1,
            },
          ],
          doPolygonsOverlap: true,
        },
      });

      // user then requests an estimate for said polygons
      newState = reducer(newState, {
        type: 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED',
        payload: {
          cumulativeTotalEtInAcreFeet: 100,
          conservationPayment: 200,
          dataCollections: [
            {
              waterConservationApplicationEstimateLocationId: 'location-guid',
              polygonWkt: polygonWkt,
              averageYearlyTotalEtInAcreFeet: 50,
              averageYearlyTotalEtInInches: 400,
              averageYearlyNetEtInInches: null,
              averageYearlyNetEtInAcreFeet: null,
              datapoints: [
                {
                  year: 2025,
                  totalEtInInches: 400,
                  effectivePrecipitationInInches: null,
                  netEtInInches: null,
                },
              ],
            },
          ],
        },
      });

      // user fills out part of the application submission form...
      newState = reducer(newState, {
        type: 'APPLICATION_SUBMISSION_FORM_UPDATED',
        payload: {
          formValues: {
            ...defaultApplicationSubmissionFormData(),
            fieldDetails: [
              {
                waterConservationApplicationEstimateLocationId: 'location-guid',
                additionalDetails: 'I, the user, have some things to say about this field.',
              },
            ],
          },
        },
      });

      expect(newState.conservationApplication.applicationSubmissionForm.fieldDetails.length).toBeGreaterThan(0);

      // user then goes back to change their polygon selections
      newState = reducer(newState, {
        type: 'MAP_POLYGONS_UPDATED',
        payload: {
          polygons: [],
          doPolygonsOverlap: false,
        },
      });

      // Assert
      // their AdditionalDetails field should be reset
      expect(newState.conservationApplication.applicationSubmissionForm.fieldDetails.length).toEqual(0);
    });
  });
});
