import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHomePageContext } from '../Provider';

function UploadModal() {
    const { showUploadModal, setShowUploadModal } = useHomePageContext();
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadError, setUploadError] = useState<JSX.Element | null>(null);
    const [fileContent, setFileContent] = useState<any>(null);
    const [fileInputValue, setFileInputValue] = useState('');

    const resetState = () => {
        setUploadError(null);
        setIsUploaded(false);
        setIsUploading(false);
        setFileContent(null);
        setFileInputValue('');
    };

    const close = () => {
        setShowUploadModal(false);
        resetState();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadError(null);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parsedFileContent = JSON.parse(content);

                    console.log("Parsed File Data:", parsedFileContent);

                    setFileContent(parsedFileContent);
                    setIsUploaded(true);
                    setIsUploading(false);
                } catch (err) {
                    setUploadError(<ErrorMessageInvalidFile />);
                    setIsUploading(false);
                    setFileInputValue('');
                }
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        if (isUploaded && !uploadError) {
            console.log("File content in useEffect:", fileContent);
            const timer = setTimeout(() => {
                close();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isUploaded, uploadError, fileContent]);

    return (
        <Modal show={showUploadModal} onHide={close} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!isUploading && !isUploaded && (
                    <>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Label>Choose JSON or GeoJSON file to upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".json, .geojson"
                                    onChange={handleFileUpload}
                                    value={fileInputValue}
                                />
                            </Form.Group>
                        </Form>
                        {uploadError && <div>{uploadError}</div>}
                    </>
                )}

                {isUploading && (
                    <p>Your file is being uploaded, this might take some time...</p>
                )}

                {isUploaded && (
                    <p className="text-success mt-3">File uploaded and parsed successfully!</p>
                )}
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {!uploadError && !isUploading && <Button className="btn btn-secondary" onClick={close}>Cancel</Button>}
                {uploadError && <Button className="btn btn-secondary" onClick={close}>Okay</Button>}
            </Modal.Footer>
        </Modal>
    );
}

function ErrorMessageInvalidFile() {
    return (
        <p className="text-danger">
            The file you uploaded is invalid. Please upload a valid JSON or GeoJSON file.
        </p>
    );
}

export default UploadModal;
