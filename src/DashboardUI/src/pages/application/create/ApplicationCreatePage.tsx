import { useNavigate } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Form from 'react-bootstrap/esm/Form';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import Button from 'react-bootstrap/esm/Button';
import { states } from '../../../config/states';
import {
  CompensationRateUnits,
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
  CompensationRateUnitsOptions,
} from '../../../data-contracts/CompensationRateUnits';
import { formatNumber } from '../../../utilities/valueFormatters';
import { useRef } from 'react';
import { ApplicationSubmissionForm } from '../../../data-contracts/ApplicationSubmissionForm';

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const navigateToEstimationToolPage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/estimation`);
  };

  return (
    <div className="application-create-page d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToEstimationToolPage}
        backButtonText="Back to Estimator"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <ApplicationCreatePageForm />
      </div>
    </div>
  );
}

const responsiveOneThirdWidthDefault = 'col-lg-3 col-md-4 col-6';
const responsiveOneHalfWidthDefault = 'col-lg-4 col-md-6 col-12';
const responsiveFullWidthDefault = 'col-lg-6 col-12';

function ApplicationCreatePageForm() {
  const { state } = useConservationApplicationContext();

  const landownerFirstNameRef = useRef<HTMLInputElement>(null);
  const landownerLastNameRef = useRef<HTMLInputElement>(null);
  const landownerEmailRef = useRef<HTMLInputElement>(null);
  const landownerPhoneNumberRef = useRef<HTMLInputElement>(null);
  const landownerAddressRef = useRef<HTMLInputElement>(null);
  const landownerCityRef = useRef<HTMLInputElement>(null);
  const landownerStateRef = useRef<HTMLSelectElement>(null);
  const landownerZipCodeRef = useRef<HTMLInputElement>(null);
  const agentFirstNameRef = useRef<HTMLInputElement>(null);
  const agentEmailRef = useRef<HTMLInputElement>(null);
  const agentPhoneNumberRef = useRef<HTMLInputElement>(null);
  const agentAdditionalDetailsRef = useRef<HTMLTextAreaElement>(null);
  const projectLocationRef = useRef<HTMLInputElement>(null);
  const propertyAdditionalDetailsRef = useRef<HTMLTextAreaElement>(null);
  const diversionPointRef = useRef<HTMLInputElement>(null);
  const diversionPointDetailsRef = useRef<HTMLTextAreaElement>(null);
  const canalOrIrrigationEntityNameRef = useRef<HTMLInputElement>(null);
  const canalOrIrrigationEntityEmailRef = useRef<HTMLInputElement>(null);
  const canalOrIrrigationEntityPhoneNumberRef = useRef<HTMLInputElement>(null);
  const permitNumberRef = useRef<HTMLInputElement>(null);
  const facilityDitchNameRef = useRef<HTMLInputElement>(null);
  const priorityDateRef = useRef<HTMLInputElement>(null);
  const certificateNumberRef = useRef<HTMLInputElement>(null);
  const shareNumberRef = useRef<HTMLInputElement>(null);
  const waterRightStateRef = useRef<HTMLSelectElement>(null);
  const waterUseDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const estimationSupplementaryDetailsRef = useRef<HTMLInputElement>(null);
  const conservationPlanFundingRequestDollarAmountRef = useRef<HTMLInputElement>(null);
  const conservationPlanFundingRequestCompensationRateUnitsRef = useRef<HTMLSelectElement>(null);
  const conservationPlanDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const conservationPlanAdditionalInfoRef = useRef<HTMLTextAreaElement>(null);

  const onFormChanged = () => {
    const conservationPlanFundingRequestDollarAmount = Number(
      conservationPlanFundingRequestDollarAmountRef.current?.value,
    );

    const cpfrcruValueAsEnum = Number(
      conservationPlanFundingRequestCompensationRateUnitsRef.current?.value,
    ) as CompensationRateUnits;
    const conservationPlanFundingRequestCompensationUnits:
      | Exclude<CompensationRateUnits, CompensationRateUnits.None>
      | undefined = cpfrcruValueAsEnum === CompensationRateUnits.None ? undefined : cpfrcruValueAsEnum;

    const form: ApplicationSubmissionForm = {
      landownerFirstName: landownerFirstNameRef.current?.value,
      landownerLastName: landownerLastNameRef.current?.value,
      landownerEmail: landownerEmailRef.current?.value,
      landownerPhoneNumber: landownerPhoneNumberRef.current?.value,
      landownerAddress: landownerAddressRef.current?.value,
      landownerCity: landownerCityRef.current?.value,
      landownerState: landownerStateRef.current?.value,
      landownerZipCode: landownerZipCodeRef.current?.value,
      agentName: agentFirstNameRef.current?.value,
      agentEmail: agentEmailRef.current?.value,
      agentPhoneNumber: agentPhoneNumberRef.current?.value,
      agentAdditionalDetails: agentAdditionalDetailsRef.current?.value,
      projectLocation: projectLocationRef.current?.value,
      propertyAdditionalDetails: propertyAdditionalDetailsRef.current?.value,
      diversionPoint: diversionPointRef.current?.value,
      diversionPointDetails: diversionPointDetailsRef.current?.value,
      canalOrIrrigationEntityName: canalOrIrrigationEntityNameRef.current?.value,
      canalOrIrrigationEntityEmail: canalOrIrrigationEntityEmailRef.current?.value,
      canalOrIrrigationEntityPhoneNumber: canalOrIrrigationEntityPhoneNumberRef.current?.value,
      permitNumber: permitNumberRef.current?.value,
      facilityDitchName: facilityDitchNameRef.current?.value,
      priorityDate: priorityDateRef.current?.value,
      certificateNumber: certificateNumberRef.current?.value,
      shareNumber: shareNumberRef.current?.value,
      waterRightState: waterRightStateRef.current?.value,
      waterUseDescription: waterUseDescriptionRef.current?.value,
      estimationSupplementaryDetails: estimationSupplementaryDetailsRef.current?.value,
      conservationPlanFundingRequestDollarAmount: conservationPlanFundingRequestDollarAmount,
      conservationPlanFundingRequestCompensationRateUnits: conservationPlanFundingRequestCompensationUnits,
      conservationPlanDescription: conservationPlanDescriptionRef.current?.value,
      conservationPlanAdditionalInfo: conservationPlanAdditionalInfoRef.current?.value,
    };

    console.log('form', form);
  };

  // assumes all polygons are not intersecting
  const acreageSum = state.conservationApplication.selectedMapPolygons.reduce(
    (sum, polygon) => sum + polygon.acreage,
    0,
  );
  const etAcreFeet = state.conservationApplication.polygonEtData.reduce(
    (sum, polygon) => sum + polygon.averageYearlyEtInAcreFeet,
    0,
  );

  return (
    <div className="container">
      <div className="mb-3">
        <span className="fs-4 fw-bold">New Application</span>
      </div>

      <div className="d-flex gap-3 mb-4">
        <span className="fw-bold">Water Right Native ID: {state.conservationApplication.waterRightNativeId}</span>

        <span className="fw-bold">
          Application ID: {state.conservationApplication.waterConservationApplicationDisplayId}
        </span>

        <span className="fw-bold">Funding Organization: {state.conservationApplication.fundingOrganizationName}</span>
      </div>

      <div className="mb-4">
        <span>
          Complete the below fields in order to submit your application to your state agency for verification. Be sure
          everything is filled out accurately and truthfully.
        </span>
      </div>

      <Form onChange={onFormChanged} noValidate>
        <FormSection title="Applicant Information">
          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerFirstName">
            <Form.Label>Landowner First Name</Form.Label>
            <Form.Control type="text" maxLength={100} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerLastName">
            <Form.Label>Landowner Last Name</Form.Label>
            <Form.Control type="text" maxLength={100} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerPhoneNumber">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="tel" maxLength={50} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerCity">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" maxLength={100} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerState">
            <Form.Label>State</Form.Label>
            <Form.Select required>
              <option value={''}>Select a state</option>
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="landownerZipCode">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control type="text" maxLength={10} required />
          </Form.Group>
        </FormSection>

        <FormSection
          title="Representative / Agent Contact Information"
          subtitle="Is this application being submitted by a representative of the water right’s holder? If yes, please provide the representative’s contact information."
        >
          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="agentName">
            <Form.Label>Name / Organization</Form.Label>
            <Form.Control type="text" maxLength={100} />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="agentEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" maxLength={255} />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="agentPhoneNumber">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="tel" maxLength={50} />
          </Form.Group>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="agentAdditionalDetails">
            <Form.Label>Additional Details</Form.Label>
            <Form.Control as="textarea" maxLength={4000} />
          </Form.Group>
        </FormSection>

        <div className="row">
          <FormSection title="Property & Land Area Information" className="col-6">
            <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="projectLocation">
              <Form.Label> Project Location</Form.Label>
              <Form.Control type="text" maxLength={255} required />
            </Form.Group>

            <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="propertyAdditionalDetails">
              <Form.Label>Additional Details</Form.Label>
              <Form.Control as="textarea" maxLength={4000} required />
            </Form.Group>

            <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="diversionPoint">
              <Form.Label>Diversion Point</Form.Label>
              <Form.Control type="text" maxLength={255} required />
            </Form.Group>

            <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="diversionPointDetails">
              <Form.Label>Diversion Point Details</Form.Label>
              <Form.Control as="textarea" maxLength={4000} required />
            </Form.Group>
          </FormSection>

          <div className="col-6">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        <FormSection
          title="Canal Company / Irrigation District"
          subtitle="Is your water right part of a canal company or irrigation district? If yes, please provide their contact
              information."
        >
          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="canalOrIrrigationEntityName">
            <Form.Label>Name / Organization</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneHalfWidthDefault} mb-4`} controlId="canalOrIrrigationEntityEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" maxLength={255} required />
          </Form.Group>

          <Form.Group
            className={`${responsiveOneHalfWidthDefault} mb-4`}
            controlId="canalOrIrrigationEntityPhoneNumber"
          >
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" maxLength={50} required />
          </Form.Group>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="canalOrIrrigationAdditionalDetails">
            <Form.Label>Additional Details</Form.Label>
            <Form.Control as="textarea" maxLength={4000} />
          </Form.Group>
        </FormSection>

        <FormSection title="Water Right Information">
          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="permitNumber">
            <Form.Label>Permit #</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="facilityDitchName">
            <Form.Label>Facility (Ditch) Name</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="priorityDate">
            <Form.Label>Priority Date</Form.Label>
            <Form.Control type="date" required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="certificateNumber">
            <Form.Label>Certificate #</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="shareNumber">
            <Form.Label>Share #</Form.Label>
            <Form.Control type="text" maxLength={255} required />
          </Form.Group>

          <Form.Group className={`${responsiveOneThirdWidthDefault} mb-4`} controlId="waterRightState">
            <Form.Label>State</Form.Label>
            <Form.Select required>
              <option value={''}>Select a state</option>
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="waterUseDescription">
            <Form.Label>Description of Water Use</Form.Label>
            <Form.Control as="textarea" maxLength={4000} required />
          </Form.Group>
        </FormSection>

        <FormSection title="Estimation Summary">
          <div className="row mb-4">
            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Irrigated Field Area</span>
              </div>
              <div>
                <span>{formatNumber(acreageSum, 2)} Acres</span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Consumptive Use</span>
              </div>
              <div>
                <span>{formatNumber(etAcreFeet, 2)} Acre-Feet</span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Compensation Rate</span>
              </div>
              <div>
                <span>
                  ${state.conservationApplication.desiredCompensationDollars}/
                  {CompensationRateUnitsLabelsSingular[state.conservationApplication.desiredCompensationUnits!]}
                </span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Requested Total ($)</span>
              </div>
              <div>
                <span>${formatNumber(state.conservationApplication.conservationPayment, 0)}</span>
              </div>
            </div>
          </div>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="estimationSupplementaryDetails">
            <Form.Label>
              Do you have supplementary data that can help in reviewing this estimate? If so, provide that here.
            </Form.Label>
            <Form.Control type="text" required />
          </Form.Group>
        </FormSection>

        <FormSection title="Conservation Plan">
          <Form.Group
            className={`${responsiveOneHalfWidthDefault} mb-4`}
            controlId="conservationPlanFundingRequestDollarAmount"
          >
            <Form.Label>Funding Request $ Amount</Form.Label>
            <Form.Control type="number" required />
          </Form.Group>

          <Form.Group
            className={`${responsiveOneHalfWidthDefault} mb-4`}
            controlId="conservationPlanFundingRequestCompensationRateUnits"
          >
            <Form.Label>Units</Form.Label>
            <Form.Select required>
              <option value={0}>Select an option</option>
              {CompensationRateUnitsOptions.map((value) => (
                <option key={value} value={value}>
                  {CompensationRateUnitsLabelsPlural[value]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="conservationPlanDescription">
            <Form.Label>Describe your Conservation Plan.</Form.Label>
            <Form.Control as="textarea" required />
          </Form.Group>

          <Form.Group className={`${responsiveFullWidthDefault} mb-4`} controlId="conservationPlanAdditionalInfo">
            <Form.Label>Additional Information</Form.Label>
            <Form.Control as="textarea" required />
          </Form.Group>
        </FormSection>

        <FormSection title="Supporting Documents (Optional)">
          <div className="col mb-4">
            <Button
              variant="outline-primary"
              onClick={() => alert('This feature will be implemented in a future release.')}
            >
              Upload
            </Button>
          </div>
        </FormSection>
      </Form>

      <hr className="m-0" />
      <div className="d-flex justify-content-end p-3">
        <Button variant="success" onClick={() => alert('This feature will be implemented in a future release.')}>
          Review & Submit
        </Button>
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode | undefined;
}

function FormSection(props: FormSectionProps) {
  return (
    <div className={props.className}>
      <div className="mb-4">
        <div>
          <span className="fs-5">{props.title}</span>
        </div>

        {props.subtitle && (
          <div>
            <span className="text-muted">{props.subtitle}</span>
          </div>
        )}
      </div>

      <div className="row">{props.children}</div>
    </div>
  );
}
