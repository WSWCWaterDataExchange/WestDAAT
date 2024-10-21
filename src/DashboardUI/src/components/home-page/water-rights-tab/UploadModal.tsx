import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHomePageContext } from '../Provider';
import * as geojson from 'geojson';

function UploadModal() {
    const { showUploadModal, setShowUploadModal } = useHomePageContext();
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadError, setUploadError] = useState<JSX.Element | null>(null);
    const [geoJSONData, setGeoJSONData] = useState<geojson.FeatureCollection | null>(null);
    const [fileInputValue, setFileInputValue] = useState('');

    const resetState = () => {
        setUploadError(null);
        setIsUploaded(false);
        setIsUploading(false);
        setGeoJSONData(null);
        setFileInputValue('');
    };

    const closeModal = () => {
        setShowUploadModal(false);
        resetState();
    };

    const handleError = (errorType: string) => {
        switch (errorType) {
            case 'Invalid JSON':
                setUploadError(<ErrorMessageInvalidJSON />);
                break;
            default:
                setUploadError(<ErrorMessageNotGeoJSONOrPolygon />);
        }
        setIsUploading(false);
        setFileInputValue('');
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

        setIsUploading(true);
        setUploadError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileContent = e.target?.result as string;
                const parsedData = JSON.parse(fileContent);

                if (!validateGeoJSONPolygon(parsedData)) {
                    throw new Error('Invalid GeoJSON or no Polygon/MultiPolygon');
                }

                setGeoJSONData(parsedData);
                setIsUploaded(true);
                setIsUploading(false);
            } catch (err) {
                handleError((err as Error).message || 'Invalid JSON');
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (isUploaded && !uploadError) {
            console.log("Uploaded GeoJSON Data:", geoJSONData);
            const timer = setTimeout(() => closeModal(), 1500);
            return () => clearTimeout(timer);
        }
    }, [isUploaded, uploadError, geoJSONData]);

    return (
        <Modal show={showUploadModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload GeoJSON Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!isUploading && !isUploaded && (
                    <>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Label>Select JSON or GeoJSON file to upload</Form.Label>
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

                {isUploading && <p>Uploading your file, please wait...</p>}

                {isUploaded && <p className="text-success mt-3">GeoJSON Polygon uploaded and processed successfully!</p>}
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {!uploadError && !isUploading && <Button className="btn btn-secondary" onClick={closeModal}>Cancel</Button>}
                {uploadError && <Button className="btn btn-secondary" onClick={closeModal}>Okay</Button>}
            </Modal.Footer>
        </Modal>
    );
}

function ErrorMessageInvalidJSON() {
    return (
        <p className="text-danger">
            The uploaded file is not valid JSON. Please upload a properly formatted JSON or GeoJSON file.
        </p>
    );
}

function ErrorMessageNotGeoJSONOrPolygon() {
    return (
        <p className="text-danger">
            The uploaded file is either not valid GeoJSON or does not contain a Polygon or MultiPolygon geometry. Please ensure that the file follows the correct GeoJSON format.
        </p>
    );
}

export default UploadModal;
