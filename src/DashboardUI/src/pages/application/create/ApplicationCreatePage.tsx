import { useNavigate } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { useRef, useState } from 'react';
import ApplicationDocumentUploadSection from '../components/ApplicationDocumentUploadSection';
import Button from 'react-bootstrap/esm/Button';

const perspective: ApplicationReviewPerspective = 'applicant'; // hard-coded for this page

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);
  const [documentUploading, setDocumentUploading] = useState(false);

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

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToEstimationToolPage}
        backButtonText="Back to Estimator"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <main className="container">
          <ApplicationReviewHeader perspective={perspective} />
          <ApplicationSubmissionForm ref={formRef} formValidated={formValidated} />
          <ApplicationDocumentUploadSection
            perspective={perspective}
            documentUploadProps={{ documentUploadingHandler: setDocumentUploading }}
          />
          <ApplicantButtonRow documentUploading={documentUploading} handleSubmitClicked={handleSubmitClicked} />
        </main>
      </div>
    </div>
  );
}

interface ApplicantButtonRowProps {
  documentUploading: boolean;
  handleSubmitClicked: () => void;
}

function ApplicantButtonRow(props: ApplicantButtonRowProps) {
  const { documentUploading, handleSubmitClicked } = props;

  return (
    <div className="d-flex justify-content-end p-3">
      <Button variant="success" onClick={handleSubmitClicked} disabled={documentUploading}>
        Review & Submit
      </Button>
    </div>
  );
}
