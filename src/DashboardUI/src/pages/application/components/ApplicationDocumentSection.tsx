import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { ApplicationDocumentDownload } from './ApplicationDocumentDownload';
import { ApplicationDocumentUpload } from './ApplicationDocumentUpload';
import ApplicationFormSection from './ApplicationFormSection';

interface ApplicationDocumentSectionProps {
  readOnly: boolean;
}

function ApplicationDocumentSection(props: ApplicationDocumentSectionProps) {
  const { readOnly } = props;

  return (
    <>
      {readOnly && <ApplicationFormSectionRule width={2} />}
      <ApplicationFormSection title="Supporting Documents (Optional)" className={`col mb-4`}>
        {readOnly ? <ApplicationDocumentDownload /> : <ApplicationDocumentUpload />}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationDocumentSection;
