import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHomePageContext } from '../Provider';
import * as geojson from 'geojson';

function UploadModal() {
    const { showUploadModal, setShowUploadModal, setUploadedGeoJSON } = useHomePageContext();
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const resetState = () => {
        setErrorMessage(null);
        setUploadStatus('idle');
    };

    const closeModal = () => {
        setShowUploadModal(false);
        resetState();
    };

    const handleError = (errorType: string) => {
        switch (errorType) {
            case 'Invalid JSON':
                setErrorMessage('The uploaded file is not valid JSON. Please upload a properly formatted JSON or GeoJSON file.');
                break;
            default:
                setErrorMessage('The uploaded file is either not valid GeoJSON or does not contain a Polygon or MultiPolygon geometry. Please ensure that the file follows the correct GeoJSON format.');
        }
        setUploadStatus('idle');
    };

    const validateGeoJSONPolygon = (data: any): boolean => {
        if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
            return false;
        }
        return data.features.every((feature: geojson.Feature) => {
            return (
                feature.geometry &&
                (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
            );
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        setErrorMessage(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileContent = e.target?.result as string;
                const parsedData = JSON.parse(fileContent);

                if (!validateGeoJSONPolygon(parsedData)) {
                    throw new Error('Invalid GeoJSON or no Polygon/MultiPolygon');
                }

                setUploadedGeoJSON(parsedData); // Save the GeoJSON in context
                setUploadStatus('uploaded');
            } catch (err) {
                handleError((err as Error).message || 'Invalid JSON');
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (uploadStatus === 'uploaded' && !errorMessage) {
            const timer = setTimeout(() => closeModal(), 1500);
            return () => clearTimeout(timer);
        }
    }, [uploadStatus, errorMessage]);

    return (
        <Modal show={showUploadModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Upload GeoJSON Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {uploadStatus === 'idle' && (
                    <>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Label>Select JSON or GeoJSON file to upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".json, .geojson"
                                    onChange={handleFileUpload}
                                />
                            </Form.Group>
                        </Form>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </>
                )}

                {uploadStatus === 'uploading' && <p>Uploading your file, please wait...</p>}

                {uploadStatus === 'uploaded' && <p className="text-success mt-3">GeoJSON Polygon uploaded successfully!</p>}
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {uploadStatus === 'idle' && <Button className="btn btn-secondary" onClick={closeModal}>Cancel</Button>}
                {errorMessage && <Button className="btn btn-secondary" onClick={closeModal}>Okay</Button>}
            </Modal.Footer>
        </Modal>
    );
}

export default UploadModal;
