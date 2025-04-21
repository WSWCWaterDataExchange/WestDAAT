import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { useNavigate } from 'react-router-dom';

export interface ControlPointRequiredModalProps {
  show: boolean;
  onClose: () => void;
}

export function ControlPointRequiredModal(props: ControlPointRequiredModalProps) {
  const navigate = useNavigate();

  const navigateToEstimator = () => {
    navigate('map');
  };
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onClose}>
        <Modal.Title>Control Point is Missing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          A control point is required in order to submit a recommendation for this application.
        </div>
        <div>
          Please set the control point and select the "Retrieve Estimate and Save Changes" option under Estimate
          Consumptive Use. This can be found within the Edit in Estimator tool, in the Property & Land Area Information.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={navigateToEstimator}>
          Take me to the Estimator
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
