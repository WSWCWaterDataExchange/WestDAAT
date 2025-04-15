import { mdiDownload, mdiFileDocument } from '@mdi/js';
import { Icon } from '@mdi/react';
import Button from 'react-bootstrap/esm/Button';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import './application-document.scss';

interface ApplicationDocumentDownloadProps {
  onDownloadClicked: (fileName: string, fileId?: string) => void;
}

export function ApplicationDocumentDownload(props: ApplicationDocumentDownloadProps) {
  const { state } = useConservationApplicationContext();

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
                      onClick={() => props.onDownloadClicked(file.fileName, file.id)}
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
