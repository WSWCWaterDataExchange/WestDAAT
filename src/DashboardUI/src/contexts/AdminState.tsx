import { produce } from 'immer';

export interface AdminState {
  organizations: string[];
}

export const defaultState = (): AdminState => ({
  organizations: [],
});

export type AdminAction = AdminOrganizationsLoadedAction;

export interface AdminOrganizationsLoadedAction {
  type: 'ADMIN_ORGANIZATIONS_LOADED';
  payload: { organizations: string[] };
}

export const reducer = (state: AdminState, action: AdminAction): AdminState => {
  // Wrap reducer in immer's produce function so we can
  // mutate the draft state without mutating the original state.
  return produce(state, (draftState) => {
    return reduce(draftState, action);
  });
};

// Given an action and the current state, return the new state
const reduce = (draftState: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'ADMIN_ORGANIZATIONS_LOADED':
      return onAdminOrganizationsLoaded(draftState, action);
    default:
      return draftState;
  }
};

const onAdminOrganizationsLoaded = (draftState: AdminState, action: AdminOrganizationsLoadedAction): AdminState => {
  draftState.organizations = action.payload.organizations;
  return draftState;
};
