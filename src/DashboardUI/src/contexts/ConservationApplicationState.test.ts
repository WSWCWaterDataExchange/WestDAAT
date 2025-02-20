import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { CompensationRateUnits } from '../data-contracts/CompensationRateUnits';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import {
  ConservationApplicationState,
  defaultState,
  reducer
} from './ConservationApplicationState';

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
        compensationRateUnits: CompensationRateUnits.Acres
      },
    ];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATION_FILTERS_CHANGED',
      payload: { applicationIds: ['application-guid-2', 'application-guid-3', 'application-guid-4', 'application-guid-5'] },
    })

    // Assert
    expect(newState.dashboardApplicationsStatistics).toEqual({
      submittedApplications: 4,
      acceptedApplications: 2,
      rejectedApplications: 1,
      inReviewApplications: 1,
      cumulativeEstimatedSavingsAcreFeet: 300,
      totalObligationDollars: 400,
    })
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
});
