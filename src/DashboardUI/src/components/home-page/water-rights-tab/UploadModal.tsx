import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// @ts-ignore
import shp from 'shpjs';
import * as shapefile from 'shapefile';
import { useHomePageContext } from '../Provider';
import * as geojson from 'geojson';

const validateGeoJSONPolygon = (data: geojson.FeatureCollection): boolean => {
    return data.features.every(
        (feature: geojson.Feature) =>
            feature.geometry &&
            (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
    );
};

const readFile = (file: File, format: 'arraybuffer' | 'text'): Promise<ArrayBuffer | string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer | string);
        reader.onerror = () => reject(new Error('Failed to read file. Please try again.'));
        if (format === 'arraybuffer') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    });
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
                    const fileContent = (await readFile(file, 'text')) as string;
                    await processGeoJSON(fileContent);
                    break;
                }
                case fileName.endsWith('.zip'): {
                    const fileContent = (await readFile(file, 'arraybuffer')) as ArrayBuffer;
                    await processShapefileZip(fileContent);
                    break;
                }
                case fileName.endsWith('.shp'): {
                    const fileContent = (await readFile(file, 'arraybuffer')) as ArrayBuffer;
                    await processShapefile(fileContent);
                    break;
                }
                default: {
                    setErrorMessage(
                        'Unsupported file type. Please upload a .json, .geojson, .zip, or .shp file containing shapefiles.'
                    );
                    setUploadStatus('idle');
                    break;
                }
            }
        } catch {
            setErrorMessage('Failed to read the uploaded file.');
            setUploadStatus('idle');
        }
    };

    const processGeoJSON = async (fileContent: string) => {
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

    const processShapefileZip = async (fileContent: ArrayBuffer) => {
        try {
            const geojsonData = await shp(fileContent);

            let featureCollection: geojson.FeatureCollection;

            if (Array.isArray(geojsonData)) {
                featureCollection = {
                    type: 'FeatureCollection',
                    features: geojsonData.flatMap(fc => fc.features),
                };
            } else {
                featureCollection = geojsonData;
            }

            if (
                featureCollection &&
                featureCollection.features.length > 0 &&
                validateGeoJSONPolygon(featureCollection)
            ) {
                setUploadedGeoJSON(featureCollection);
                setUploadStatus('uploaded');
                closeModal();
            } else {
                setErrorMessage(
                    'The uploaded shapefile does not contain valid Polygon or MultiPolygon geometries.'
                );
                setUploadStatus('idle');
            }
        } catch {
            setErrorMessage('Failed to process the uploaded shapefile.');
            setUploadStatus('idle');
        }
    };

    const processShapefile = async (arrayBuffer: ArrayBuffer) => {
        try {
            const source = await shapefile.open(arrayBuffer);

            const features: geojson.Feature[] = [];
            let result = await source.read();
            while (!result.done) {
                features.push(result.value);
                result = await source.read();
            }

            const featureCollection: geojson.FeatureCollection = {
                type: 'FeatureCollection',
                features: features,
            };

            if (validateGeoJSONPolygon(featureCollection)) {
                setUploadedGeoJSON(featureCollection);
                setUploadStatus('uploaded');
                closeModal();
            } else {
                setErrorMessage('The file does not contain valid Polygon or MultiPolygon data.');
                setUploadStatus('idle');
            }
        } catch {
            setErrorMessage('Failed to process the .shp file.');
            setUploadStatus('idle');
        }
    };

    const renderModalBodyContent = () => {
        if (uploadStatus === 'idle') {
            return (
                <>
                    <Form>
                        <Form.Group controlId="formFile">
                            <Form.Label>Select a .json, .geojson, .zip, or .shp file</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".json, .geojson, .zip, .shp"
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
                <Modal.Title>Upload GeoJSON, JSON, or Shapefile (.zip or .shp)</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderModalBodyContent()}</Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end' }}>
                {uploadStatus === 'idle' && (
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                )}
                {errorMessage && (
                    <Button variant="secondary" onClick={closeModal}>
                        Okay
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default UploadModal;
