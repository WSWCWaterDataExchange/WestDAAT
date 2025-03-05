import { useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { states } from '../../config/states';
import { countries } from '../../config/countries';
import Button from 'react-bootstrap/esm/Button';

export function SignupPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const affiliatedOrganizationRef = useRef<HTMLInputElement>(null);

  const [validated, setValidated] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const editForm = (
    <Form noValidate validated={validated} className="row mb-3" ref={formRef}>
      <Form.Group className="mb-2 col-12">
        <Form.Label className="fw-bold">First name</Form.Label>
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
        <Form.Label className="fw-bold">Last name</Form.Label>
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

      <Button className="fs-5 my-3 py-3 w-100">Continue</Button>
    </div>
  );
}
