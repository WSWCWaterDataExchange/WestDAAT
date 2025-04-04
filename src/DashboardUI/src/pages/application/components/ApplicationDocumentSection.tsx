import { ApplicationDocumentDownload } from './ApplicationDocumentDownload';
import { ApplicationDocumentUpload } from './ApplicationDocumentUpload';
import ApplicationFormSection from './ApplicationFormSection';

interface ApplicationDocumentSectionProps {
  readOnly: boolean;
}

function ApplicationDocumentSection(props: ApplicationDocumentSectionProps) {
  const { readOnly } = props;

  const sectionRule = <hr className="text-primary" style={{ borderWidth: 2 }} />;
  return (
    <>
      {readOnly && sectionRule}
      <ApplicationFormSection title="Supporting Documents (Optional)" className={`col mb-4`}>
        {readOnly ? <ApplicationDocumentDownload /> : <ApplicationDocumentUpload />}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationDocumentSection;
