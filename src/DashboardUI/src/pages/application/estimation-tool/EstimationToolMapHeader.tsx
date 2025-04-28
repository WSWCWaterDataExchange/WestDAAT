import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { EstimationToolHelpVideo } from './EstimationToolHelpVideo';
import { useMapContext } from '../../../contexts/MapProvider';

export function EstimationToolMapHeader() {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const mapContext = useMapContext();

  const handleUploadClicked = () => {
    // alert('This feature will be implemented in a future release.');
    mapContext.exportToPngFn!({
      height: 600,
      width: 800,
    });
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

        <Button variant="outline-primary" onClick={handleUploadClicked}>
          Upload File
        </Button>
      </div>

      <Modal dialogClassName="modal-75w" centered show={showVideoPlayer} onHide={() => setShowVideoPlayer(false)}>
        <EstimationToolHelpVideo onVideoEnd={() => setShowVideoPlayer(false)} />
      </Modal>
    </div>
  );
}
