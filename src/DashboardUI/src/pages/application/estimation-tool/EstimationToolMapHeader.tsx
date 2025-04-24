import { useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { parseGISFileToGeoJSON } from '../../../utilities/gisFileParser';
import { FeatureCollection } from 'geojson';
import { toast } from 'react-toastify';
import { fromGeometryFeatureToMapSelectionPolygonData } from '../../../utilities/mapUtility';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Modal from 'react-bootstrap/esm/Modal';
import { EstimationToolHelpVideo } from './EstimationToolHelpVideo';

export function EstimationToolMapHeader() {
  const { dispatch } = useConservationApplicationContext();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = async (file: File): Promise<FeatureCollection> => {
    let data: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    try {
      data = await parseGISFileToGeoJSON(file);
    } catch (error: any) {
      toast.error(`Error parsing file: "${error.message}"`);
    }

    return data;
  };

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // combine files' data into a single collection
    const uploadedFileFeatures: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData = await parseFile(file);
      uploadedFileFeatures.features.push(...fileData.features);
    }

    dispatch({
      type: 'GIS_FILE_POLYGONS_UPLOADED',
      payload: {
        polygons: uploadedFileFeatures.features.map(fromGeometryFeatureToMapSelectionPolygonData).map((polygon, i) => ({
          ...polygon,
          fieldName: 'test ' + i,
        })),
      },
    });

    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-3 d-flex flex-column gap-2 d-print-none">
      <div>
        <span className="h5 fw-bold">Estimate consumptive use through OpenET for an irrigated field</span>
      </div>

      <div className="me-2">
        <span>
          Click once to begin drawing a polygon around your land by using the shape tool. Then, use the panel on the
          left to review estimates and potential compensation as part of a voluntary and temporary measure.
        </span>
        <Button className="py-0 px-2 align-baseline fw-bold" variant="link" onClick={() => setShowVideoPlayer(true)}>
          How does this work?
        </Button>
      </div>

      <div>
        <span className="me-2">Or, you can upload a file from your device.</span>

        <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
          Upload File
        </Button>

        <input
          type="file"
          accept=".json, .geojson, .zip, .shp"
          multiple
          className="d-none"
          ref={fileInputRef}
          onChange={handleFilesSelected}
        />
      </div>

      <Modal dialogClassName="modal-75w" centered show={showVideoPlayer} onHide={() => setShowVideoPlayer(false)}>
        <EstimationToolHelpVideo onVideoEnd={() => setShowVideoPlayer(false)} />
      </Modal>
    </div>
  );
}
