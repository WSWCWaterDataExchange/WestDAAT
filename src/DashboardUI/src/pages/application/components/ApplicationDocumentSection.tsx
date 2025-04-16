import { toast } from 'react-toastify';
import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { ApplicationDocumentDownload } from './ApplicationDocumentDownload';
import { ApplicationDocumentUpload } from './ApplicationDocumentUpload';
import ApplicationFormSection from './ApplicationFormSection';
import { downloadApplicationDocuments } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';

interface ApplicationDocumentSectionProps {
  readOnly: boolean;
}

function ApplicationDocumentSection(props: ApplicationDocumentSectionProps) {
  const msalContext = useMsal();
  const { readOnly } = props;

  const handleDownload = async (fileName: string, fileId?: string) => {
    if (!fileId) {
      throw new Error('File ID is required to download the document');
    }

    toast.info(`Downloading ${fileName}`, { autoClose: 1000 });

    await downloadApplicationDocuments(msalContext, fileId).catch(() =>
      toast.error(`An error occurred while downloading ${fileName}`, {
        autoClose: 3000,
      }),
    );
  };

  return (
    <>
      {readOnly && <ApplicationFormSectionRule width={2} />}
      <ApplicationFormSection title="Supporting Documents (Optional)" className={`col mb-4`}>
        {readOnly ? ( //
          <ApplicationDocumentDownload onDownloadClicked={handleDownload} />
        ) : (
          <ApplicationDocumentUpload onDownloadClicked={handleDownload} />
        )}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationDocumentSection;
