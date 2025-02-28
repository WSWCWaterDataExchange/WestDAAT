import { produce } from 'immer';

export interface AdminState {
  organizations: string[];
  profileForm: null | ProfileFormFields;
}

export const defaultState = (): AdminState => ({
  organizations: [],
  profileForm: null,
});

export type AdminAction =
  | AdminOrganizationsLoadedAction //
  | ProfileEditStartedAction
  | ProfileFormChangedAction;

interface AdminOrganizationsLoadedAction {
  type: 'ADMIN_ORGANIZATIONS_LOADED';
  payload: { organizations: string[] };
}

interface ProfileFormFields {
  firstName: string | null;
  lastName: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
}

interface ProfileEditStartedAction {
  type: 'PROFILE_EDIT_STARTED';
  payload: ProfileFormFields;
}

interface ProfileFormChangedAction {
  type: 'PROFILE_FORM_CHANGED';
  payload: ProfileFormFields;
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
    case 'PROFILE_EDIT_STARTED':
      return onProfileEditStarted(draftState, action);
    case 'PROFILE_FORM_CHANGED':
      return onProfileFormChanged(draftState, action);
    default:
      return draftState;
  }
};

const onAdminOrganizationsLoaded = (draftState: AdminState, action: AdminOrganizationsLoadedAction): AdminState => {
  draftState.organizations = action.payload.organizations;
  return draftState;
};

const onProfileEditStarted = (draftState: AdminState, action: ProfileEditStartedAction): AdminState => {
  draftState.profileForm = action.payload;
  return draftState;
};

const onProfileFormChanged = (draftState: AdminState, action: ProfileFormChangedAction): AdminState => {
  draftState.profileForm = action.payload;
  return draftState;
};
