import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { defaultApplicationSubmissionFormData } from '../data-contracts/ApplicationSubmissionFormData';
import { ApplicationDocument } from '../data-contracts/ApplicationDocuments';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import { ConservationApplicationState, defaultState, reducer } from './ConservationApplicationState';
import { MapSelectionPolygonData } from '../data-contracts/CombinedPolygonData';
import { ApplicationDetails } from '../data-contracts/ApplicationDetails';
import { applicationDetailsMock } from '../mocks/ApplicationDetails.mock';
import { ApplicationReviewNote } from '../data-contracts/ApplicationReviewNote';
import { DrawToolType } from '../data-contracts/DrawToolType';

const shouldBeAbleToPerformConsumptiveUseEstimate = (state: ConservationApplicationState, expected: boolean): void => {
  expect(state.canEstimateConsumptiveUse).toEqual(expected);
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
      { ...mockApplication, applicationId: 'application-guid-2', status: ConservationApplicationStatus.Rejected },
      { ...mockApplication, applicationId: 'application-guid-3', status: ConservationApplicationStatus.InReview },
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
      acceptedApplications: 2,
      rejectedApplications: 1,
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
      acceptedApplications: 0,
      rejectedApplications: 0,
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('updating map polygons should update state', () => {
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
    shouldBeAbleToContinueToApplication(newState, false);
  });

  it('estimating consumptive use should update state', () => {
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
      type: 'CONSUMPTIVE_USE_ESTIMATED',
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

    shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
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
      shouldBeAbleToPerformConsumptiveUseEstimate(state, false);
    });

    it('estimate consumptive use should be disabled when more than 20 polygons have been selected', () => {
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
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);
    });

    it('estimate consumptive use should be enabled when at least one map polygon is present', () => {
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
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, true);
    });

    it('estimate consumptive use should be enabled or disabled depending on the sidebar inputs', () => {
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
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, true);

      // estimation form has partial data
      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: 100,
          desiredCompensationUnits: undefined,
        },
      });
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);

      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: undefined,
          desiredCompensationUnits: CompensationRateUnits.AcreFeet,
        },
      });
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, false);

      // estimation form has all data
      newState = reducer(newState, {
        type: 'ESTIMATION_FORM_UPDATED',
        payload: {
          desiredCompensationDollars: 100,
          desiredCompensationUnits: CompensationRateUnits.AcreFeet,
        },
      });
      shouldBeAbleToPerformConsumptiveUseEstimate(newState, true);
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
        type: 'CONSUMPTIVE_USE_ESTIMATED',
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
    it('loading application should hydrate state', () => {
      // Arrange
      const applicationDetails: ApplicationDetails = applicationDetailsMock();
      const note: ApplicationReviewNote = {
        id: 'note-guid',
        submittedDate: '2025-01-01T00:00:00.0000000 +00:00',
        submittedByUserId: 'user-guid',
        submittedByFullName: 'first last',
        note: 'This is a note from a reviewer.',
      };

      // Act
      const newState = reducer(state, {
        type: 'APPLICATION_LOADED',
        payload: {
          application: applicationDetails,
          notes: [note],
        },
      });

      // Assert
      const application = newState.conservationApplication;

      // application / application estimate
      expect(application.waterConservationApplicationId).toEqual(applicationDetails.id);
      expect(application.waterRightNativeId).toEqual(applicationDetails.waterRightNativeId);
      expect(application.fundingOrganizationId).toEqual(applicationDetails.fundingOrganizationId);

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

      // application estimate location consumptive uses
      const consumptiveUse = location.datapoints![0];
      const expectedConsumptiveUse = expectedLocation.consumptiveUses[0];
      expect(location.datapoints!.length).toEqual(expectedLocation.consumptiveUses.length);
      expect(consumptiveUse.year).toEqual(expectedConsumptiveUse.year);
      expect(consumptiveUse.totalEtInInches).toEqual(expectedConsumptiveUse.totalEtInInches);

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
      expect(applicationNote.id).toEqual(note.id);
      expect(applicationNote.submittedByFullName).toEqual(note.submittedByFullName);
      expect(applicationNote.submittedDate).toEqual(note.submittedDate);
      expect(applicationNote.note).toEqual(note.note);

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
    });
  });

  describe('Additional Use Cases', () => {
    it("should reset the Application Submission form's polygons' AdditionalDetails fields if the user updates their polygon selections.", () => {
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
        type: 'CONSUMPTIVE_USE_ESTIMATED',
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
