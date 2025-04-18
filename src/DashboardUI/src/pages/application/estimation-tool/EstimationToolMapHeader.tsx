import { useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { parseGISFileToGeoJSON } from '../../../utilities/gisFileParser';
import { FeatureCollection } from 'geojson';
import { toast } from 'react-toastify';

export function EstimationToolMapHeader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      let data: FeatureCollection | undefined = undefined;
      try {
        data = await parseGISFileToGeoJSON(file);
      } catch (error: any) {
        toast.error(`Error parsing file: "${error.message}"`);
      }
    }

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

      <div>
        <span className="me-2">
          Click once to begin drawing a polygon around your land by using the shape tool. Then, use the panel on the
          left to review estimates and potential compensation as part of a voluntary and temporary measure.
        </span>
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
    </div>
  );
}
