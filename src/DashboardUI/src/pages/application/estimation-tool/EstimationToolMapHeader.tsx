import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { EstimationToolHelperVideo } from './EstimationToolHelperVideo';

export function EstimationToolMapHeader() {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

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
        <Button className="" variant="link" onClick={() => setShowVideoPlayer(true)}>
          How does this work?
        </Button>
      </div>

      <div>
        <span className="me-2">Or, you can upload a file from your device.</span>

        <Button
          variant="outline-primary"
          onClick={() => alert('This feature will be implemented in a future release.')}
        >
          Upload File
        </Button>
      </div>

      <Modal centered show={showVideoPlayer} onHide={() => setShowVideoPlayer(false)}>
        <EstimationToolHelperVideo />
      </Modal>
    </div>
  );
}
