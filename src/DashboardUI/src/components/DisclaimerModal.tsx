import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';

interface DisclaimerModalProps extends ModalProps {
  acceptDisclaimer: (today: Date) => void;
}

function DisclaimerModal(props: DisclaimerModalProps) {

  const close = () => {
    props.acceptDisclaimer(new Date());
  }

  return (
    <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title id="contained-modal-title-vcenter">
          Disclaimer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        The Western States Water Council provides this tool, data, and documentation “AS IS,” and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose, are disclaimed. In no event shall the Western States Water Council nor any of the entities providing financial support be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, loss of use, loss of or corruption of data, or loss of profits; or security breach; or business interruption; procurement of substitute goods or services) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software or documentation, even if advised of the possibility of such damage.
Individual states have unique water rights administration systems. Please check the metadata before making any comparisons. The purpose of WaDE is to support regional water data and availability analysis. This data is not meant for localized decisions. Before drawing any conclusions or comparing, please consult the state's water rights agency and its methods. Please also consult with the WaDE team before using this tool.
For more info, please visit: <a href="https://westernstateswater.org/wade/westdaat-terms-of-service/" target="_blank" rel="noopener noreferrer">https://westernstateswater.org/wade/westdaat-terms-of-service/</a>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Okay</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DisclaimerModal;
