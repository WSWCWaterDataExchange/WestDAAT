import { ApplicationDashboardListItem } from '../data-contracts/ApplicationDashboardListItem';
import { ConservationApplicationStatus } from '../data-contracts/ConservationApplicationStatus';
import { reducer, defaultState, ConservationApplicationState, DashboardApplicationsLoadedAction } from './ConservationApplicationState';

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
