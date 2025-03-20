import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import useDirtyFormCheck from '../../../hooks/useDirtyFormCheck';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import ApplicationDocumentUploadSection from '../components/ApplicationDocumentUploadSection';
import { useRef, useState } from 'react';
import ApplicationReviewPipelineSection from '../components/ApplicationReviewPipelineSection';
import Button from 'react-bootstrap/esm/Button';

const perspective: ApplicationReviewPerspective = 'reviewer';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const [documentUploading, setDocumentUploading] = useState(false);

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const isFormDirty = useDirtyFormCheck(state.conservationApplication.applicationSubmissionForm, {
    isEnabled: !isApplicationLoading && !isFundingOrganizationLoading,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);

  const alertNotImplemented = () => alert('Not implemented. This feature will be implemented in a future release.');

  const handleSaveClicked = () => {
    const form = formRef.current;
    const isFormValid = form!.checkValidity();
    setFormValidated(true);

    if (isFormValid) {
      alertNotImplemented();
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!isApplicationLoading && !isFundingOrganizationLoading && (
          <div className="container">
            <ApplicationReviewHeader perspective={perspective} />
            <ApplicationSubmissionForm ref={formRef} formValidated={formValidated} />
            <ApplicationDocumentUploadSection
              perspective={perspective}
              documentUploadProps={{ documentUploadingHandler: setDocumentUploading }}
            />
            <ApplicationReviewPipelineSection />
            <ReviewerButtonRow
              documentUploading={documentUploading}
              isFormDirty={isFormDirty}
              handleCancelClicked={alertNotImplemented}
              handleSaveClicked={handleSaveClicked}
              handleSubmitForFinalReviewClicked={alertNotImplemented}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationReviewPage;

interface ReviewerButtonRowProps {
  documentUploading: boolean;
  isFormDirty: boolean;
  handleCancelClicked: () => void;
  handleSaveClicked: () => void;
  handleSubmitForFinalReviewClicked: () => void;
}

function ReviewerButtonRow(props: ReviewerButtonRowProps) {
  const { documentUploading, isFormDirty, handleCancelClicked, handleSaveClicked, handleSubmitForFinalReviewClicked } =
    props;

  return (
    <div className="d-flex justify-content-between p-3">
      <div>
        <Button variant="secondary" onClick={handleCancelClicked}>
          Cancel
        </Button>
      </div>

      <div className="d-flex gap-3">
        <Button variant="outline-success" onClick={handleSaveClicked} disabled={documentUploading || !isFormDirty}>
          Save Changes
        </Button>

        <Button variant="success" onClick={handleSubmitForFinalReviewClicked} disabled={documentUploading}>
          Submit for Final Review
        </Button>
      </div>
    </div>
  );
}
