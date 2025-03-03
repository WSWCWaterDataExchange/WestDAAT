import { useNavigate } from 'react-router-dom';
import MapProvider from '../../../contexts/MapProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Form from 'react-bootstrap/esm/Form';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Button from 'react-bootstrap/esm/Button';
import { states } from '../../../config/states';
import {
  CompensationRateUnitsLabelsPlural,
  CompensationRateUnitsLabelsSingular,
  CompensationRateUnitsOptions,
} from '../../../data-contracts/CompensationRateUnits';
import { formatNumber } from '../../../utilities/valueFormatters';

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const navigateToEstimationToolPage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/estimation`);
  };

  return (
    <MapProvider>
      <div className="application-create-page d-flex flex-column flex-grow-1 h-100">
        <ApplicationNavbar
          navigateBack={navigateToEstimationToolPage}
          backButtonText="Back to Estimator"
          centerText="Water Conservation Estimation Tool"
        />

        <ApplicationCreatePageForm />

        <hr className="m-0" />
        <div className="d-flex justify-content-end p-3">
          <Button variant="success" onClick={() => alert('Not Implemented.')}>
            Review & Submit
          </Button>
        </div>
      </div>
    </MapProvider>
  );
}

const emptyStringPlaceholder = '';
function ApplicationCreatePageForm() {
  const { state } = useConservationApplicationContext();

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
    <div className="flex-grow-1 overflow-y-auto p-4">
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

      <Form>
        <FormSection title="Applicant Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerFirstName" label="Landowner First Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={100} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerLastName" label="Landowner Last Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={100} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerEmail" label="Email Address">
              <Form.Control placeholder={emptyStringPlaceholder} type="email" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerPhoneNumber" label="Phone">
              <Form.Control placeholder={emptyStringPlaceholder} type="tel" maxLength={50} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerAddress" label="Address">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerCity" label="City">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={100} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerState" label="State">
              <Form.Select required>
                <option value={''}>Select a state</option>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerZipCode" label="Zip Code">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={10} required />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Agent Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentFirstName" label="Agent First Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={100} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentLastName" label="Agent Last Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={100} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentEmail" label="Agent Email">
              <Form.Control placeholder={emptyStringPlaceholder} type="email" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentPhoneNumber" label="Agent Phone">
              <Form.Control placeholder={emptyStringPlaceholder} type="tel" maxLength={50} required />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <div className="row">
          <FormSection title="Property & Land Area Information" className="col-6">
            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="projectLocation" label="Project Location">
                <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="propertyAdditionalDetails" label="Additional Details">
                <Form.Control as="textarea" placeholder={emptyStringPlaceholder} maxLength={4000} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="diversionPoint" label="Diversion Point">
                <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="diversionPointDetails" label="Diversion Point Details">
                <Form.Control as="textarea" placeholder={emptyStringPlaceholder} maxLength={4000} required />
              </FloatingLabel>
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
          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityName" label="Entity Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityEmail" label="Entity Email">
              <Form.Control placeholder={emptyStringPlaceholder} type="email" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityPhoneNumber" label="Entity Phone">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={50} required />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Water Right Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="permitNumber" label="Permit #">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="facilityDitchName" label="Facility (Ditch) Name">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="priorityDate" label="Priority Date">
              <Form.Control placeholder={emptyStringPlaceholder} type="date" required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="certificateNumber" label="Certificate #">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="shareNumber" label="Share #">
              <Form.Control placeholder={emptyStringPlaceholder} type="text" maxLength={255} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="waterRightState" label="State">
              <Form.Select required>
                <option value={''}>Select a state</option>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="waterUseDescription" label="Description of Water Use">
              <Form.Control as="textarea" placeholder={emptyStringPlaceholder} maxLength={4000} required />
            </FloatingLabel>
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

          <Form.Group className="col-12 mb-4">
            <FloatingLabel
              controlId="estimationSupplementaryDetails"
              label="Do you have supplementary data that can help in reviewing this estimate? If so, provide that here."
            >
              <Form.Control placeholder={emptyStringPlaceholder} type="text" required />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Conservation Plan">
          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="conservationPlanFundingRequestDollarAmount" label="Funding Request $ Amount">
              <Form.Control placeholder={emptyStringPlaceholder} type="number" required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="conservationPlanFundingRequestCompensationRateUnits" label="Units">
              <Form.Select required>
                <option value={0}>Select an option</option>
                {CompensationRateUnitsOptions.map((value) => (
                  <option key={value} value={value}>
                    {CompensationRateUnitsLabelsPlural[value]}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="conservationPlanDescription" label="Describe your Conservation Plan.">
              <Form.Control as="textarea" placeholder={emptyStringPlaceholder} required />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="conservationPlanAdditionalInfo" label="Additional Information">
              <Form.Control as="textarea" placeholder={emptyStringPlaceholder} required />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Supporting Documents (Optional)">
          <div className="col mb-4">
            <Button variant="outline-primary" onClick={() => alert('Not Implemented.')}>
              Upload
            </Button>
          </div>
        </FormSection>
      </Form>
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
