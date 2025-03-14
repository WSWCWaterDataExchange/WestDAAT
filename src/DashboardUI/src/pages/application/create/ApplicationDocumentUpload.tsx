import { useMsal } from '@azure/msal-react';
import { mdiTrashCanOutline } from '@mdi/js';
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

export interface ApplicationDocumentUploadProps {
  documentUploadingHandler: (isUploading: boolean) => void;
}

export function ApplicationDocumentUpload(props: ApplicationDocumentUploadProps) {
  const msalContext = useMsal();
  const { state, dispatch } = useConservationApplicationContext();
  const [uploadDocumentErrorMessage, setUploadDocumentErrorMessage] = useState<string | null>(null);
  const uploadDocumentMutation = useMutation({
    mutationFn: async (params: { files: File[] }) => {
      props.documentUploadingHandler(true);
      clearUploadDocumentError();
      return await uploadApplicationDocuments(msalContext, params.files);
    },
    onSuccess: (uploadedDocuments: ApplicationDocument[]) => {
      props.documentUploadingHandler(false);
      dispatch({
        type: 'APPLICATION_DOCUMENT_UPLOADED',
        payload: {
          uploadedDocuments,
        },
      });
    },
    onError: () => {
      props.documentUploadingHandler(false);
      setUploadDocumentError('An error occurred while uploading the document(s). Please try again.');
    },
  });

  const MAX_NUMBER_UPLOADED_DOCUMENTS = 10;
  const UPLOADED_DOCUMENT_MAX_SIZE_MB = 25;

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

  // TODO: JN - in PR, add note about aria-label for progress bar and link to this: https://github.com/react-bootstrap/react-bootstrap/pull/6739
  return (
    <>
      {uploadDocumentErrorMessage !== null && (
        <Alert variant="danger" dismissible onClose={clearUploadDocumentError}>
          {uploadDocumentErrorMessage}
        </Alert>
      )}
      <div className="col mb-4">
        {state.conservationApplication.supportingDocuments.length > 0 && (
          <table className="table">
            <tbody>
              {state.conservationApplication.supportingDocuments.map((file, index) => (
                <tr key={`${file.fileName}-${index}`}>
                  <td className="align-content-center">{file.fileName}</td>
                  <td className="align-content-center flex-grow-1">
                    <Form.Group controlId={`supportingDocumentsDescription-${index}`}>
                      <Form.Control
                        as="textarea"
                        maxLength={4000}
                        value={file.description}
                        onChange={(e) => handleDocumentDescriptionChanged(file.blobName, e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </td>
                  <td className="align-content-center text-center">
                    <Button
                      variant="link"
                      className="px-1 py-1 text-danger"
                      onClick={() => handleRemoveDocument(file.blobName)}
                    >
                      <Icon
                        path={mdiTrashCanOutline}
                        size="1.5em"
                        aria-label="Remove supporting document button"
                      ></Icon>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Fade in={uploadDocumentMutation.isLoading}>
          <div className="container">
            <ProgressBar
              className="my-4"
              animated
              now={100}
              visuallyHidden
              label="Document upload in progress, please wait..."
              aria-label="Document upload in progress, please wait..."
            />
          </div>
        </Fade>

        <Button variant="outline-primary" onClick={handleUploadDocument} disabled={uploadDocumentMutation.isLoading}>
          Upload
        </Button>
      </div>
    </>
  );
}
