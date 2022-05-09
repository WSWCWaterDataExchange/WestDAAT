import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';

interface DisclaimerModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

function DisclaimerModal(props: DisclaimerModalProps) {

  const close = () => {
    localStorage.setItem("disclaimer", "donotshow");
    props.setShow(false);
  }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
          Disclaimer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This application is under construction, not for public use,
          and has not yet been fully approved by our member states.
          Individual states have unique water rights administration
          systems. Please check metadata before making any comparisons.
          The purpose of WaDE is to support regional water data and
          availability analysis. This data is not meant for localized decisions.
          Before drawing any conclusions or making comparisons,
          please consult the state's water rights agency and their used
          methods. Please also consult with the WaDE team before using
          this tool. We look forward to hearing your feedback.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Okay</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DisclaimerModal;
