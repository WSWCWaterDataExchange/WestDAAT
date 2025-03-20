import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import { ApplicationDocumentUpload } from './ApplicationDocumentUpload';
import ApplicationFormSection from './ApplicationFormSection';

interface ApplicationDocumentUploadSectionProps {
  perspective: ApplicationReviewPerspective;
}

function ApplicationDocumentUploadSection(props: ApplicationDocumentUploadSectionProps) {
  const { perspective } = props;

  return (
    <ApplicationFormSection title="Supporting Documents (Optional)" className={`col mb-4`}>
      {perspective === 'reviewer' ? (
        <>
          <NotImplementedPlaceholder />
          <span className="fw-bold">
            Document Upload is not implemented for Reviewers yet. This feature will be implemented in a future release.
          </span>
        </>
      ) : (
        <ApplicationDocumentUpload />
      )}
    </ApplicationFormSection>
  );
}

export default ApplicationDocumentUploadSection;
