import { reducer, defaultState, AdminState } from './AdminState';

describe('AdminState reducer', () => {
  let state: AdminState;

  beforeEach(() => {
    state = { ...defaultState() };
  });

  it('loading organizations should update state', () => {
    // Arrange
    const organizations = ['org1', 'org2'];

    // Act
    const newState = reducer(state, {
      type: 'ADMIN_ORGANIZATIONS_LOADED',
      organizations,
    });

    // Assert
    expect(newState.organizations).toEqual(organizations);
  });
});
