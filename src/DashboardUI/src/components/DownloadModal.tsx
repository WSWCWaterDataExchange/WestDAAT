import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { AppContext } from '../AppProvider';

interface DownloadModalProps extends ModalProps {
  setShow: (show: boolean) => void;
}

function DownloadModal(props: DownloadModalProps) {

  const { isAuthenticated } = useContext(AppContext).authenticationContext;
  const close = () => {
    props.setShow(false);
  }

  const handleLogin = () => {
    // bubble up something so the parent catches and does the log in request
  }

  const download = () => {
    // do the download calls
    // probably display modals that the operation was success or failed for whatever reason ?
    props.setShow(false);
  }

  return (
    <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
        { !isAuthenticated && <label>Login for Download Access</label> }
        { isAuthenticated && <label>Download - PLACEHOLDER</label> }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sign up <strong>completely free</strong> or login for down access of up to 100.000
          water rights points.
        </p>
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-between'}}>
      <Button className="btn btn-secondary" onClick={close}>Cancel</Button>
      {!isAuthenticated && <Button onClick={handleLogin}>Log In</Button>}
      {isAuthenticated && <Button onClick={download}>Download</Button>}
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadModal;
