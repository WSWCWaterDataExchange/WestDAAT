import { useMsal } from '@azure/msal-react';
import { mdiDownload, mdiFileDocument } from '@mdi/js';
import { Icon } from '@mdi/react';
import Button from 'react-bootstrap/esm/Button';
import { toast, ToastContainer } from 'react-toastify';
import { downloadApplicationDocuments } from '../../../accessors/applicationAccessor';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import './application-document.scss';

export function ApplicationDocumentDownload() {
  const msalContext = useMsal();
  const { state } = useConservationApplicationContext();

  const handleDownload = async (fileName: string, fileId?: string) => {
    if (!fileId) {
      throw new Error('File ID is required to download the document');
    }

    toast.info(`Downloading ${fileName}`);

    await downloadApplicationDocuments(msalContext, fileId).catch(() =>
      toast.error(`An error occurred while downloading ${fileName}`, {
        autoClose: 3000,
      }),
    );
  };

  return (
    <div className="col">
      {state.conservationApplication.supportingDocuments.length === 0 && (
        <div className="text-muted">(No supporting documents have been provided)</div>
      )}

      {state.conservationApplication.supportingDocuments.length > 0 && (
        <table className="table document-table">
          <tbody>
            {state.conservationApplication.supportingDocuments.map((file) => (
              <tr key={file.blobName}>
                <td className="col-4 text-nowrap align-content-center px-2 py-3">
                  <Icon path={mdiFileDocument} size="1.5em" className="text-primary me-3" />
                  {file.fileName}
                </td>
                <td className="align-content-center text-start">{file.description}</td>
                {file.id !== undefined && (
                  <td className="col-1 align-content-center text-center">
                    <Button
                      variant="link"
                      className="px-1 py-1 text-primary"
                      onClick={() => handleDownload(file.fileName, file.id)}
                      aria-label="Download supporting document"
                    >
                      <Icon path={mdiDownload} size="1.5em" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
