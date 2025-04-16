import { useNavigate } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { useRef, useState } from 'react';
import ApplicationDocumentSection from '../components/ApplicationDocumentSection';
import Button from 'react-bootstrap/esm/Button';

const perspective: ApplicationReviewPerspective = 'applicant';

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);

  const navigateToEstimationToolPage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/estimation`);
  };

  const navigateToSubmitApplicationPage = () => {
    navigate(`/application/${state.conservationApplication.waterConservationApplicationId}/submit`);
  };

  const handleSubmitClicked = () => {
    const form = formRef.current;
    const isFormValid = form!.checkValidity();

    setFormValidated(true);

    if (isFormValid) {
      navigateToSubmitApplicationPage();
    }
  };

  const pageHeaderInstructions =
    'Complete the below fields in order to submit your application to your state agency for verification. Be sure everything is filled out accurately and truthfully.';

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToEstimationToolPage}
        backButtonText="Back to Estimator"
        centerText="New Application"
        centerTextIsLoading={false}
        displayWaterIcon={false}
      />

      <div className="overflow-y-auto">
        <div className="container">
          <ApplicationReviewHeader additionalText={pageHeaderInstructions} />
          <ApplicationSubmissionForm perspective={perspective} ref={formRef} formValidated={formValidated} />
          <ApplicationDocumentSection perspective={perspective} readOnly={false} />
          <ApplicantButtonRow handleSubmitClicked={handleSubmitClicked} />
        </div>
      </div>
    </div>
  );
}

interface ApplicantButtonRowProps {
  handleSubmitClicked: () => void;
}

function ApplicantButtonRow(props: ApplicantButtonRowProps) {
  const { state } = useConservationApplicationContext();
  const { handleSubmitClicked } = props;

  return (
    <div className="d-flex justify-content-end p-3">
      <Button variant="success" onClick={handleSubmitClicked} disabled={state.isUploadingDocument}>
        Review & Submit
      </Button>
    </div>
  );
}
