import { useNavigate } from 'react-router-dom';
import MapProvider from '../../../contexts/MapProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Form from 'react-bootstrap/esm/Form';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Button from 'react-bootstrap/esm/Button';

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
      </div>
    </MapProvider>
  );
}

const emptyStringPlaceholder = '';
function ApplicationCreatePageForm() {
  const { state } = useConservationApplicationContext();

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
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerLastName" label="Landowner Last Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerEmail" label="Email Address">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerPhoneNumber" label="Phone">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerAddress" label="Address">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerCity" label="City">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          {/* todo: form select */}
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerState" label="State">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerZipCode" label="Zip Code">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Agent Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentFirstName" label="Agent First Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentLastName" label="Agent Last Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentEmail" label="Agent Email">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="agentPhoneNumber" label="Agent Phone">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <div className="row">
          <FormSection title="Property & Land Area Information" className="col-6">
            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="projectLocation" label="Project Location">
                <Form.Control placeholder={emptyStringPlaceholder} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="propertyAdditionalDetails" label="Additional Details">
                <Form.Control as="textarea" placeholder={emptyStringPlaceholder} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="diversionPoint" label="Diversion Point">
                <Form.Control placeholder={emptyStringPlaceholder} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="col-12 mb-4">
              <FloatingLabel controlId="diversionPointDetails" label="Diversion Point Details">
                <Form.Control as="textarea" placeholder={emptyStringPlaceholder} />
              </FloatingLabel>
            </Form.Group>
          </FormSection>

          <div className="col-6">
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        <FormSection title="Canal Company / Irrigation District">
          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityName" label="Entity Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityEmail" label="Entity Email">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="canalOrIrrigationEntityPhoneNumber" label="Entity Phone">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Water Right Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="permitNumber" label="Permit #">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="facilityDitchName" label="Facility (Ditch) Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="priorityDate" label="Priority Date">
              <Form.Control placeholder={emptyStringPlaceholder} type="date" />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="certificateNumber" label="Certificate #">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="shareNumber" label="Share #">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          {/* todo: form select */}
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="waterRightState" label="State">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="waterUseDescription" label="Description of Water Use">
              <Form.Control as="textarea" placeholder={emptyStringPlaceholder} />
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
                <span>x Acres</span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Consumptive Use</span>
              </div>
              <div>
                <span>x Acre-Feet</span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Compensation Rate</span>
              </div>
              <div>
                <span>$x/Acre-Feet</span>
              </div>
            </div>

            <div className="col-3 d-flex flex-column">
              <div>
                <span className="fw-bold">Requested Total ($)</span>
              </div>
              <div>
                <span>$x</span>
              </div>
            </div>
          </div>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel
              controlId="estimationSupplementaryDetails"
              label="Do you have supplementary data that can help in reviewing this estimate? If so, provide that here."
            >
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Conservation Plan">
          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="conservationPlanFundingRequestDollarAmount" label="Funding Request $ Amount">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-6 mb-4">
            <FloatingLabel controlId="conservationPlanFundingRequestCompensationRateUnits" label="Units">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="conservationPlanDescription" label="Describe your Conservation Plan.">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-12 mb-4">
            <FloatingLabel controlId="conservationPlanAdditionalInfo" label="Additional Information">
              <Form.Control placeholder={emptyStringPlaceholder} />
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
  className?: string;
  children: React.ReactNode | undefined;
}

function FormSection(props: FormSectionProps) {
  return (
    <div className={props.className}>
      <div className="mb-4">
        <span className="fs-5">{props.title}</span>
      </div>

      <div className="row">{props.children}</div>
    </div>
  );
}
