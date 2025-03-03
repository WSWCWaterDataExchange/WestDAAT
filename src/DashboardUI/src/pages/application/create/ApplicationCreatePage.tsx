import { useNavigate } from 'react-router-dom';
import MapProvider from '../../../contexts/MapProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Form from 'react-bootstrap/esm/Form';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';

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
  return (
    <div className="flex-grow-1 overflow-y-auto p-4">
      <div>
        <span>New Application</span>
      </div>

      <div className="d-flex gap-3">
        <span>Water Right Native ID:</span>

        <span>Application ID: </span>

        <span>Funding Organization :</span>
      </div>

      <div>
        <span>
          Complete the below fields in order to submit your application to your state agency for verification. Be sure
          everything is filled out accurately and truthfully.
        </span>
      </div>

      <Form>
        <FormSection title="Applicant Information">
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="landownerName" label="Landowner Name">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="emailAddress" label="Email Address">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="phoneNumber" label="Phone">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="address" label="Address">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="city" label="City">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          {/* todo: form select */}
          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="state" label="State">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="col-4 mb-4">
            <FloatingLabel controlId="zipCode" label="Zip Code">
              <Form.Control placeholder={emptyStringPlaceholder} />
            </FloatingLabel>
          </Form.Group>
        </FormSection>

        <FormSection title="Agent Information">
          <Form.Group></Form.Group>
        </FormSection>

        <div className="d-flex justify-content-between">
          <FormSection title="Property & Land Area Information">
            <Form.Group></Form.Group>
          </FormSection>

          <div>
            Static map here
            <NotImplementedPlaceholder />
          </div>
        </div>

        <FormSection title="Canal Company / Irrigation District">
          <Form.Group></Form.Group>
        </FormSection>

        <FormSection title="Water Right Information">
          <Form.Group></Form.Group>
        </FormSection>

        <FormSection title="Estimation Summary">
          <Form.Group></Form.Group>
        </FormSection>

        <FormSection title="Conservation Plan">
          <Form.Group></Form.Group>
        </FormSection>

        <FormSection title="Supporting Documents (Optional)">
          <Form.Group></Form.Group>
        </FormSection>
      </Form>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode | undefined;
}

function FormSection(props: FormSectionProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
      </div>

      <div className="row">{props.children}</div>
    </div>
  );
}
