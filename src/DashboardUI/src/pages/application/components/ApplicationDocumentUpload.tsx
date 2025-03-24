import { useMsal } from '@azure/msal-react';
import { mdiFileDocument, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import Fade from 'react-bootstrap/Fade';
import { useMutation } from 'react-query';
import { uploadApplicationDocuments } from '../../../accessors/applicationAccessor';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationDocument } from '../../../data-contracts/ApplicationDocuments';
import './application-document.scss';

export function ApplicationDocumentUpload() {
  const MAX_NUMBER_UPLOADED_DOCUMENTS = 10;
  const UPLOADED_DOCUMENT_MAX_SIZE_MB = 25;

  const msalContext = useMsal();
  const { state, dispatch } = useConservationApplicationContext();
  const [uploadDocumentErrorMessage, setUploadDocumentErrorMessage] = useState<string | null>(null);

  const setIsDocumentUploading = (isUploadingDocument: boolean) => {
    dispatch({
      type: 'APPLICATION_DOCUMENT_UPLOADING',
      payload: {
        isUploadingDocument,
      },
    });
  };

  const uploadDocumentMutation = useMutation({
    mutationFn: async (params: { files: File[] }) => {
      setIsDocumentUploading(true);
      clearUploadDocumentError();
      return await uploadApplicationDocuments(msalContext, params.files);
    },
    onSuccess: (uploadedDocuments: ApplicationDocument[]) => {
      setIsDocumentUploading(false);
      dispatch({
        type: 'APPLICATION_DOCUMENT_UPLOADED',
        payload: {
          uploadedDocuments,
        },
      });
    },
    onError: () => {
      setIsDocumentUploading(false);
      setUploadDocumentError('An error occurred while uploading the document(s). Please try again.');
    },
  });

  const isOverMaxDocumentLimit = (files: File[]): boolean => {
    return state.conservationApplication.supportingDocuments.length + files.length > MAX_NUMBER_UPLOADED_DOCUMENTS;
  };

  const isOverMaxSizeLimit = (files: File[]): boolean => {
    return files.some((file) => file.size > UPLOADED_DOCUMENT_MAX_SIZE_MB * 1024 * 1024);
  };

  const handleUploadDocument = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.onchange = async (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (fileList && fileList.length > 0) {
        const files = Array.from(fileList);

        if (isOverMaxDocumentLimit(files)) {
          setUploadDocumentError('You can upload a total of 10 documents.');
          return;
        }

        if (isOverMaxSizeLimit(files)) {
          setUploadDocumentError('Each file must be smaller than 25MB.');
          return;
        }

        uploadDocumentMutation.mutate({ files });
      }
    };
    fileInput.click();
  };

  const setUploadDocumentError = (message: string) => {
    setUploadDocumentErrorMessage(message);
  };

  const clearUploadDocumentError = () => {
    setUploadDocumentErrorMessage(null);
  };

  const handleRemoveDocument = (blobName: string) => {
    dispatch({
      type: 'APPLICATION_DOCUMENT_REMOVED',
      payload: {
        removedBlobName: blobName,
      },
    });
  };

  const handleDocumentDescriptionChanged = (blobName: string, description: string) => {
    dispatch({
      type: 'APPLICATION_DOCUMENT_UPDATED',
      payload: {
        blobName,
        description,
      },
    });
  };

  return (
    <div className="col">
      {uploadDocumentErrorMessage !== null && (
        <Alert variant="danger" dismissible onClose={clearUploadDocumentError}>
          {uploadDocumentErrorMessage}
        </Alert>
      )}
      {state.conservationApplication.supportingDocuments.length > 0 && (
        <table className="table document-table">
          <tbody>
            {state.conservationApplication.supportingDocuments.map((file, index) => (
              <tr key={file.blobName}>
                <td className="col-3 text-nowrap align-content-center px-2">
                  <Icon path={mdiFileDocument} size="1.5em" className="text-primary me-3" />
                  {file.fileName}
                </td>
                <td className="align-content-center flex-grow-1">
                  <Form.Group controlId={`supportingDocumentsDescription-${index}`}>
                    <Form.Control
                      as="textarea"
                      maxLength={4000}
                      value={file.description}
                      aria-label="Document description"
                      onChange={(e) => handleDocumentDescriptionChanged(file.blobName, e.target.value)}
                    />
                  </Form.Group>
                </td>
                <td className="col-1 align-content-center text-center">
                  <Button
                    variant="link"
                    className="px-1 py-1 text-danger"
                    onClick={() => handleRemoveDocument(file.blobName)}
                  >
                    <Icon path={mdiTrashCanOutline} size="1.5em" aria-label="Remove document" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Fade in={uploadDocumentMutation.isLoading}>
        {uploadDocumentMutation.isLoading ? (
          <div className="container d-flex align-items-center mb-2">
            <div className="text-nowrap fst-italic me-4">Document Uploading...</div>
            <ProgressBar className="w-100" animated now={100} aria-label="Document upload in progress, please wait" />
          </div>
        ) : (
          <div></div>
        )}
      </Fade>

      <div className="col-4">
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={handleUploadDocument}
          disabled={uploadDocumentMutation.isLoading}
          aria-label="Upload supporting document"
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
