import { reducer, defaultState, ConservationApplicationState } from './ConservationApplicationState';

describe('ConservationApplicationState reducer', () => {
  let state: ConservationApplicationState;

  beforeEach(() => {
    state = { ...defaultState() };
  });

  it('loading dashboard applications should update state', () => {
    // Arrange
    const dashboardApplications = [];

    // Act
    const newState = reducer(state, {
      type: 'DASHBOARD_APPLICATIONS_LOADED',
      dashboardApplications: [],
    });

    // Assert
    expect(newState.dashboardApplications).toEqual([]);
  });
});
