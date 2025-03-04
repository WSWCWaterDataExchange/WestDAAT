import Alert from 'react-bootstrap/esm/Alert';
import { useUserProfile } from '../../hooks/queries/useUserQuery';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';
import Button from 'react-bootstrap/esm/Button';
import { useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { states } from '../../config/states';
import { countries } from '../../config/countries';
import { useAdminContext } from '../../contexts/AdminProvider';
import { OrganizationRolesSection } from './OrganizationRolesSection';
import { useMutation } from 'react-query';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useMsal } from '@azure/msal-react';
import { saveProfileInformation } from '../../accessors/userAccessor';

export function AccountInformationPage() {
  const msalContext = useMsal();
  const queryClient = useQueryClient();
  const { state, dispatch } = useAdminContext();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [validated, setValidated] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const affiliatedOrganizationRef = useRef<HTMLInputElement>(null);

  const {
    data: profileResponse, //
    isLoading: isProfileLoading,
    isError: hasProfileLoadError,
  } = useUserProfile();

  const saveProfileMutation = useMutation({
    mutationFn: () => {
      setIsSavingProfile(true);

      const {
        firstName, //
        lastName,
        state: _state,
        country,
        phone,
        affiliatedOrganization,
      } = state.profileForm!;

      return saveProfileInformation(msalContext, {
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        state: _state ?? '',
        country: country ?? '',
        phoneNumber: phone ?? '',
        affiliatedOrganization: affiliatedOrganization ?? null,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['user-profile', profile?.userId], {
        userProfile: {
          ...profile,
          firstName: state.profileForm?.firstName,
          lastName: state.profileForm?.lastName,
          state: state.profileForm?.state,
          country: state.profileForm?.country,
          phoneNumber: state.profileForm?.phone,
          affiliatedOrganization: state.profileForm?.affiliatedOrganization,
        },
      });

      setIsEditingProfile(false);

      toast.success('Your profile information has been saved.', {
        autoClose: 1000,
      });
    },
    onError: () => {
      toast.error('There was an error saving your profile information. Please try again.', {
        position: 'top-center',
        theme: 'colored',
      });
    },
    onSettled: () => {
      setIsSavingProfile(false);
    },
  });

  const profile = profileResponse?.userProfile;

  const labeledValue = (label: string, value: string | undefined) => {
    return (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div className="mb-4">
          {!profile && (
            <Placeholder animation="glow">
              <Placeholder xs={6} className="rounded" />
              <Placeholder xs={10} className="rounded" />
            </Placeholder>
          )}

          {profile && (
            <>
              <div className="fw-bold">{label}</div>
              <div className="text-break">{value || '-'}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleProfileFormChange = () => {
    dispatch({
      type: 'PROFILE_FORM_CHANGED',
      payload: {
        firstName: firstNameRef.current?.value ?? null,
        lastName: lastNameRef.current?.value ?? null,
        state: stateRef.current?.value ?? null,
        country: countryRef.current?.value ?? null,
        phone: phoneRef.current?.value ?? null,
        affiliatedOrganization: affiliatedOrganizationRef.current?.value ?? null,
      },
    });
  };

  const editForm = (
    <Form
      noValidate
      validated={validated}
      className="row mb-3"
      onChange={() => handleProfileFormChange()}
      ref={formRef}
    >
      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">First name</Form.Label>
        <Form.Control
          placeholder="Enter first name"
          maxLength={255}
          defaultValue={profile?.firstName}
          ref={firstNameRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">Last name</Form.Label>
        <Form.Control
          placeholder="Enter last name"
          maxLength={255}
          defaultValue={profile?.lastName}
          ref={lastNameRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">State</Form.Label>
        <Form.Select ref={stateRef} defaultValue={profile?.state} disabled={isSavingProfile} required>
          <option value={''}>Select a state</option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">Country</Form.Label>
        <Form.Select ref={countryRef} defaultValue={profile?.country} disabled={isSavingProfile} required>
          <option value={''}>Select a country</option>
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">Country is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">Phone</Form.Label>
        <Form.Control
          placeholder="Enter phone number"
          maxLength={50}
          defaultValue={profile?.phoneNumber}
          ref={phoneRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">Phone number is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <Form.Label className="fw-bold">Affiliated Organization</Form.Label>
        <Form.Control
          placeholder="Enter affiliated organization"
          maxLength={100}
          defaultValue={profile?.affiliatedOrganization ?? undefined}
          ref={affiliatedOrganizationRef}
          disabled={isSavingProfile}
        />
      </Form.Group>
    </Form>
  );

  const handleEditClicked = () => {
    setIsEditingProfile(true);
    setValidated(false);

    // If profile is loaded and form is not initialized
    // populate the form with profile data
    if (profileResponse && !state.profileForm) {
      dispatch({
        type: 'PROFILE_EDIT_STARTED',
        payload: {
          firstName: profile?.firstName ?? null,
          lastName: profile?.lastName ?? null,
          state: profile?.state ?? null,
          country: profile?.country ?? null,
          phone: profile?.phoneNumber ?? null,
          affiliatedOrganization: profile?.affiliatedOrganization ?? null,
        },
      });
    }
  };

  const handleSaveClicked = () => {
    const formIsValid = formRef.current?.checkValidity();

    setValidated(true);

    if (formIsValid) {
      saveProfileMutation.mutate();
    }
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between">
        <h1 className="fw-bold fs-4 mb-4">My Account</h1>

        {!isEditingProfile && (
          <div>
            <Button variant="link" className="text-decoration-none fw-bold" onClick={() => handleEditClicked()}>
              Edit Account Details
            </Button>
          </div>
        )}

        {isEditingProfile && (
          <div>
            <Button
              variant="secondary"
              className="px-3"
              onClick={() => setIsEditingProfile(false)}
              disabled={isSavingProfile}
            >
              Cancel
            </Button>
            <Button
              className="ms-2 px-3"
              variant="primary"
              onClick={() => handleSaveClicked()}
              disabled={isSavingProfile}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <h2 className="fs-4">Account Information</h2>
      <hr />

      {hasProfileLoadError && (
        <Alert variant="danger" className="d-flex align-items-center">
          <Icon path={mdiInformationOutline} size={1.3} />
          <span className="ms-2 fw-bold">There was an error loading your profile information. Please try again.</span>
        </Alert>
      )}

      {!hasProfileLoadError && (
        <>
          {!isEditingProfile && (
            <div className="row">
              {labeledValue('Name', profile?.firstName + ' ' + profile?.lastName)}
              {labeledValue('Email', profile?.email)}
              {labeledValue('User ID', profile?.userName)}
              {labeledValue('State', profile?.state)}
              {labeledValue('Country', profile?.country)}
              {labeledValue('Phone', profile?.phoneNumber)}
              {labeledValue('Affiliated Organization', profile?.affiliatedOrganization ?? undefined)}
            </div>
          )}

          {isEditingProfile && editForm}

          <OrganizationRolesSection profile={profile} isProfileLoading={isProfileLoading} />
        </>
      )}
    </div>
  );
}
