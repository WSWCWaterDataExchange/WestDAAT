import { reducer, defaultState, ConservationApplicationState } from './ConservationApplicationState';

describe('ConservationApplicationState reducer', () => {
  let state: ConservationApplicationState;

  beforeEach(() => {
    state = { ...defaultState() };
  });

  it('loading dashboard applications should update state', () => {
    // Arrange
    const dashboardApplications = ['app1', 'app2'];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATIONS_LOADED',
      dashboardApplications,
    });

    // Assert
    expect(newState.dashboardApplications).toEqual(dashboardApplications);
  });
});
