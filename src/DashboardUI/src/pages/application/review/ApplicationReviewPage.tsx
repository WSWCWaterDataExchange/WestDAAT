import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import useDirtyFormCheck from '../../../hooks/useDirtyFormCheck';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import ApplicationDocumentUploadSection from '../components/ApplicationDocumentUploadSection';
import { useState } from 'react';
import ApplicationReviewPipelineSection from '../components/ApplicationReviewPipelineSection';
import Button from 'react-bootstrap/esm/Button';

const perspective: ApplicationReviewPerspective = 'reviewer'; // hard-coded for this page

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

  const alertNotImplemented = () => alert('Not implemented. This feature will be implemented in a future release.');

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!isApplicationLoading && !isFundingOrganizationLoading && (
          <main className="container">
            <ApplicationReviewHeader perspective={perspective} />
            <ApplicationSubmissionForm
              perspective={perspective}
              documentUploading={documentUploading}
              isFormDirty={isFormDirty}
            />
            <ApplicationDocumentUploadSection
              perspective={perspective}
              documentUploadProps={{ documentUploadingHandler: setDocumentUploading }}
            />
            <ApplicationReviewPipelineSection />
            <ReviewerButtonRow
              documentUploading={documentUploading}
              isFormDirty={isFormDirty}
              handleCancelClicked={alertNotImplemented}
              handleSaveClicked={alertNotImplemented}
              handleSubmitForFinalReviewClicked={alertNotImplemented}
            />
          </main>
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
