import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import { ApplicationDocumentDownload } from './ApplicationDocumentDownload';
import { ApplicationDocumentUpload } from './ApplicationDocumentUpload';
import ApplicationFormSection from './ApplicationFormSection';

interface ApplicationDocumentSectionProps {
  perspective: ApplicationReviewPerspective;
}

function ApplicationDocumentSection(props: ApplicationDocumentSectionProps) {
  const { perspective } = props;

  return (
    <ApplicationFormSection title="Supporting Documents (Optional)" className={`col mb-4`}>
      {perspective === 'reviewer' ? <ApplicationDocumentDownload /> : <ApplicationDocumentUpload />}
    </ApplicationFormSection>
  );
}

export default ApplicationDocumentSection;
