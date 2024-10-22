import React, { useState, useEffect } from 'react';
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
    setUploadedGeoJSON: (geojson: any) => void,
    setErrorMessage: (message: string) => void,
    setUploadStatus: (status: 'idle' | 'uploading' | 'uploaded') => void
) => {
    try {
        const parsedData = JSON.parse(fileContent);
        if (!validateGeoJSONPolygon(parsedData)) {
            throw new Error('The file does not contain valid Polygon or MultiPolygon data.');
        }
        setUploadedGeoJSON(parsedData);
        setUploadStatus('uploaded');
    } catch (error: any) {
        setErrorMessage('The uploaded GeoJSON file is invalid.');
        setUploadStatus('idle');
    }
};

const processShapefile = async (
    fileContent: ArrayBuffer,
    setUploadedGeoJSON: (geojson: any) => void,
    setErrorMessage: (message: string) => void,
    setUploadStatus: (status: 'idle' | 'uploading' | 'uploaded') => void
) => {
    try {
        const geojsonData = await shp(fileContent);
        if (!geojsonData || geojsonData.features.length === 0 || !validateGeoJSONPolygon(geojsonData)) {
            throw new Error('The uploaded shapefile does not contain valid Polygon or MultiPolygon geometries.');
        }
        setUploadedGeoJSON(geojsonData);
        setUploadStatus('uploaded');
    } catch (error: any) {
        setErrorMessage('The uploaded shapefile is invalid.');
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
            if (fileName.endsWith('.json') || fileName.endsWith('.geojson')) {
                const fileContent = await readFile(file, 'text') as string;
                await processGeoJSON(fileContent, setUploadedGeoJSON, setErrorMessage, setUploadStatus);
            } else if (fileName.endsWith('.zip')) {
                const fileContent = await readFile(file, 'arraybuffer') as ArrayBuffer;
                await processShapefile(fileContent, setUploadedGeoJSON, setErrorMessage, setUploadStatus);
            } else {
                throw new Error('Unsupported file type. Please upload a .json, .geojson, or .zip file containing shapefiles.');
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setUploadStatus('idle');
        }
    };

    useEffect(() => {
        if (uploadStatus === 'uploaded' && !errorMessage) {
            const timer = setTimeout(() => {
                closeModal();
            }, 750);
            return () => clearTimeout(timer);
        }
    }, [uploadStatus, errorMessage]);

    return (
        <Modal show={showUploadModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Upload GeoJSON, JSON, or Shapefile (.zip)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {uploadStatus === 'idle' && (
                    <>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Label>Select a .json, .geojson, or .zip file</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".json, .geojson, .zip, .shp"
                                    onChange={handleFileUpload} />
                            </Form.Group>
                        </Form>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </>
                )}
                {uploadStatus === 'uploading' && <p>Uploading your file, please wait...</p>}
                {uploadStatus === 'uploaded' && !errorMessage && <p className="text-success mt-3">GeoJSON uploaded successfully!</p>}
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {uploadStatus === 'idle' && <Button variant="secondary" onClick={closeModal}>Cancel</Button>}
                {errorMessage && <Button variant="secondary" onClick={closeModal}>Okay</Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default UploadModal;
