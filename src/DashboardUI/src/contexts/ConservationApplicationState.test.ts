import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { defaultApplicationSubmissionForm } from '../data-contracts/ApplicationSubmissionForm';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import { EstimationFormMapPolygon } from '../data-contracts/EstimationFormMapPolygon';
import { reducer, defaultState, ConservationApplicationState } from './ConservationApplicationState';

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
            acreage: 1,
          },
        ],
        doPolygonsOverlap: true,
      },
    });

    // Assert
    expect(newState.conservationApplication.selectedMapPolygons.length).toEqual(1);
    expect(newState.conservationApplication.selectedMapPolygons[0].polygonWkt).toEqual(
      'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
    );
    expect(newState.conservationApplication.selectedMapPolygons[0].acreage).toEqual(1);
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
    // Act
    const newState = reducer(state, {
      type: 'CONSUMPTIVE_USE_ESTIMATED',
      payload: {
        totalAverageYearlyEtAcreFeet: 100,
        conservationPayment: 200,
        dataCollections: [
          {
            waterConservationApplicationEstimateLocationId: 'location-guid',
            polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
            averageYearlyEtInAcreFeet: 50,
            averageYearlyEtInInches: 400,
            datapoints: [
              {
                year: 2025,
                etInInches: 400,
              },
            ],
          },
        ],
      },
    });

    // Assert
    expect(newState.conservationApplication.totalAverageYearlyEtAcreFeet).toEqual(100);
    expect(newState.conservationApplication.conservationPayment).toEqual(200);
    expect(newState.conservationApplication.polygonEtData.length).toEqual(1);
    expect(newState.conservationApplication.polygonEtData[0].datapoints.length).toEqual(1);
    expect(newState.conservationApplication.polygonEtData[0].fieldName).toEqual('Field 1');

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
          ...defaultApplicationSubmissionForm(),
          landownerName: 'Bobby Hill',
        },
      },
    });

    // Assert
    const form = newState.conservationApplication.applicationSubmissionForm;
    expect(form.landownerName).toEqual('Bobby Hill');
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

      const polygon: EstimationFormMapPolygon = {
        polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
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

    it('estimate consumptive use should be enabled when all required data is present', () => {
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
              acreage: 1,
            },
          ],
          doPolygonsOverlap: false,
        },
      });

      // Assert
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
          totalAverageYearlyEtAcreFeet: 100,
          conservationPayment: 200,
          dataCollections: [
            {
              waterConservationApplicationEstimateLocationId: 'location-guid',
              polygonWkt: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
              averageYearlyEtInAcreFeet: 50,
              averageYearlyEtInInches: 400,
              datapoints: [
                {
                  year: 2025,
                  etInInches: 400,
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
});
