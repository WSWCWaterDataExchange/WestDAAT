import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// eslint-disable-next-line
// @ts-expect-error
import shp from 'shpjs';
import { useHomePageContext } from '../Provider';
import * as geojson from 'geojson';

const validateGeoJSONPolygon = (data: geojson.FeatureCollection): boolean => {
    return data.features.every((feature: geojson.Feature) =>
        feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
    );
};

const readFile = (file: File, format: 'arraybuffer' | 'text'): Promise<ArrayBuffer | string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer | string);
        reader.onerror = () => reject(new Error("Failed to read file. Please try again."));
        if (format === 'arraybuffer') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    });
};

const processGeoJSON = async (
    fileContent: string,
    setUploadedGeoJSON: (geojson: geojson.FeatureCollection) => void,
    setErrorMessage: (message: string) => void,
    setUploadStatus: (status: 'idle' | 'uploading' | 'uploaded') => void,
    closeModal: () => void
) => {
    try {
        const parsedData = JSON.parse(fileContent);
        if (validateGeoJSONPolygon(parsedData)) {
            setUploadedGeoJSON(parsedData);
            setUploadStatus('uploaded');
            closeModal();
        } else {
            setErrorMessage('The file does not contain valid Polygon or MultiPolygon data.');
            setUploadStatus('idle');
        }
    } catch {
        setErrorMessage('Failed to parse JSON file.');
        setUploadStatus('idle');
    }
};

const processShapefileZip = async (
    fileContent: ArrayBuffer,
    setUploadedGeoJSON: (geojson: geojson.FeatureCollection) => void,
    setErrorMessage: (message: string) => void,
    setUploadStatus: (status: 'idle' | 'uploading' | 'uploaded') => void,
    closeModal: () => void
) => {
    try {
        const geojsonData = await shp(fileContent);
        if (geojsonData && geojsonData.features.length > 0 && validateGeoJSONPolygon(geojsonData)) {
            setUploadedGeoJSON(geojsonData);
            setUploadStatus('uploaded');
            closeModal();
        } else {
            setErrorMessage('The uploaded shapefile does not contain valid Polygon or MultiPolygon geometries.');
            setUploadStatus('idle');
        }
    } catch {
        setErrorMessage('Failed to process the uploaded shapefile.');
        setUploadStatus('idle');
    }
};

const UploadModal = () => {
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileName = file.name.toLowerCase();
        setErrorMessage(null);
        setUploadStatus('uploading');

        try {
            switch (true) {
                case fileName.endsWith('.json'):
                case fileName.endsWith('.geojson'): {
                    const fileContent = await readFile(file, 'text') as string;
                    await processGeoJSON(fileContent, setUploadedGeoJSON, setErrorMessage, setUploadStatus, closeModal);
                    break;
                }
                case fileName.endsWith('.zip'): {
                    const fileContent = await readFile(file, 'arraybuffer') as ArrayBuffer;
                    await processShapefileZip(fileContent, setUploadedGeoJSON, setErrorMessage, setUploadStatus, closeModal);
                    break;
                }
                default: {
                    setErrorMessage('Unsupported file type. Please upload a .json, .geojson, or .zip file containing shapefiles.');
                    setUploadStatus('idle');
                    break;
                }
            }
        } catch {
            setErrorMessage('Failed to read the uploaded file.');
            setUploadStatus('idle');
        }
    };

    const renderModalBodyContent = () => {
        if (uploadStatus === 'idle') {
            return (
                <>
                    <Form>
                        <Form.Group controlId="formFile">
                            <Form.Label>Select a .json, .geojson, or .zip file</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".json, .geojson, .zip"
                                onChange={handleFileUpload}
                            />
                        </Form.Group>
                    </Form>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </>
            );
        } else if (uploadStatus === 'uploading') {
            return <p>Uploading your file, please wait...</p>;
        }

        return null;
    };

    return (
        <Modal show={showUploadModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Upload GeoJSON, JSON, or Shapefile (.zip)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderModalBodyContent()}
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {uploadStatus === 'idle' && <Button variant="secondary" onClick={closeModal}>Cancel</Button>}
                {errorMessage && <Button variant="secondary" onClick={closeModal}>Okay</Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default UploadModal;
