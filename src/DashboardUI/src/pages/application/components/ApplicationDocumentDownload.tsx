import { useMsal } from '@azure/msal-react';
import { mdiDownload, mdiFileDocument } from '@mdi/js';
import { Icon } from '@mdi/react';
import Button from 'react-bootstrap/esm/Button';
import { downloadApplicationDocuments } from '../../../accessors/applicationAccessor';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function ApplicationDocumentDownload() {
  const msalContext = useMsal();
  const { state } = useConservationApplicationContext();

  const handleDownload = async (fileId?: string) => {
    if (!fileId) {
      throw new Error('File ID is required to download the document');
    }
    await downloadApplicationDocuments(msalContext, fileId);
  };

  return (
    <div className="col mb-4">
      {state.conservationApplication.supportingDocuments.length === 0 && (
        <div className="text-muted">(No supporting documents have been provided)</div>
      )}

      {state.conservationApplication.supportingDocuments.length > 0 && (
        <table className="table">
          <tbody>
            {state.conservationApplication.supportingDocuments.map((file, index) => (
              <tr key={file.blobName}>
                <td className="col-4 text-nowrap align-content-center px-2 py-3">
                  <Icon path={mdiFileDocument} size="1.5em" className="text-primary me-3" />
                  {file.fileName}
                </td>
                <td className="align-content-center text-start">{file.description}</td>
                <td className="col-1 align-content-center text-center">
                  <Button
                    variant="link"
                    className="px-1 py-1 text-primary"
                    disabled={file.id === undefined}
                    onClick={() => handleDownload(file.id)}
                  >
                    <Icon path={mdiDownload} size="1.5em" aria-label="Remove document" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
