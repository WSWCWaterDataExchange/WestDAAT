import { useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { states } from '../../config/states';
import { countries } from '../../config/countries';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useMsal } from '@azure/msal-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { createProfile } from '../../accessors/userAccessor';
import { useAuthenticationContext } from '../../hooks/useAuthenticationContext';
import { UserProfileResponse } from '../../data-contracts/UserProfileResponse';
import { produce } from 'immer';

export function SignupPage() {
  const msalContext = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, authenticationComplete } = useAuthenticationContext();

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const affiliatedOrganizationRef = useRef<HTMLInputElement>(null);

  // Location state becomes null after the first render
  const [prevRoute] = useState(location.state?.from);
  const [validated, setValidated] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Redirect to home page if user is not logged in
  if (authenticationComplete && !user) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const saveProfileMutation = useMutation({
    mutationFn: () => {
      setIsSavingProfile(true);

      return createProfile(msalContext, {
        firstName: firstNameRef.current?.value ?? '',
        lastName: lastNameRef.current?.value ?? '',
        state: stateRef.current?.value ?? '',
        country: countryRef.current?.value ?? '',
        phoneNumber: phoneRef.current?.value ?? '',
        affiliatedOrganization: affiliatedOrganizationRef.current?.value ?? null,
      });
    },
    onSuccess: () => {
      const existingProfile: UserProfileResponse | undefined = queryClient.getQueryData(['user-profile', user?.userId]);

      const newCacheData = produce(existingProfile, (draft) => {
        if (draft?.userProfile) {
          // Important to avoid redirecting to this page again
          draft.userProfile.isSignupComplete = true;

          draft.userProfile.firstName = firstNameRef.current?.value ?? '';
          draft.userProfile.lastName = lastNameRef.current?.value ?? '';
          draft.userProfile.state = stateRef.current?.value ?? '';
          draft.userProfile.country = countryRef.current?.value ?? '';
          draft.userProfile.phoneNumber = phoneRef.current?.value ?? '';
          draft.userProfile.affiliatedOrganization = affiliatedOrganizationRef.current?.value ?? null;
        }
      });

      queryClient.setQueryData(['user-profile', user?.userId], newCacheData);

      const previousRoute = prevRoute ?? '/';
      navigate(previousRoute);
    },
    onError: () => {
      toast.error('There was an error saving your profile information. Please try again.', {
        position: 'top-center',
        theme: 'colored',
      });
      setIsSavingProfile(false);
    },
  });

  const handleContinueClick = () => {
    if (formRef.current?.checkValidity()) {
      saveProfileMutation.mutate();
    } else {
      setValidated(true);
    }
  };

  const editForm = (
    <Form noValidate validated={validated} className="row mb-3" ref={formRef}>
      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">First Name</Form.Label>
        <Form.Control
          placeholder="Enter first name"
          maxLength={255}
          ref={firstNameRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">Last Name</Form.Label>
        <Form.Control
          placeholder="Enter last name"
          maxLength={255}
          ref={lastNameRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">State</Form.Label>
        <Form.Select ref={stateRef} disabled={isSavingProfile} required>
          <option value={''}>Select a state</option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">Country</Form.Label>
        <Form.Select ref={countryRef} disabled={isSavingProfile} required>
          <option value={''}>Select a country</option>
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">Country is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">Phone</Form.Label>
        <Form.Control
          placeholder="Enter phone number"
          maxLength={50}
          ref={phoneRef}
          disabled={isSavingProfile}
          required
        />
        <Form.Control.Feedback type="invalid">Phone number is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">Affiliated Organization</Form.Label>
        <Form.Control
          placeholder="Enter affiliated organization"
          maxLength={100}
          ref={affiliatedOrganizationRef}
          disabled={isSavingProfile}
        />
      </Form.Group>
    </Form>
  );

  return (
    <div className="container mt-3 col-sm-12 col-md-6 col-lg-4 col-xxl-3">
      <h1 className="fw-bold fs-4">Complete your account</h1>
      <p className="m-0 mb-4">This can be changed later in your account profile.</p>
      {editForm}

      <Button className="fs-5 my-3 py-3 w-100" disabled={isSavingProfile} onClick={() => handleContinueClick()}>
        Continue
      </Button>
    </div>
  );
}
