import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';

interface AboutModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

function AboutModal(props: AboutModalProps) {

  const close = () => {
    props.setShow(false);
  }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
          About
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AboutModal;
