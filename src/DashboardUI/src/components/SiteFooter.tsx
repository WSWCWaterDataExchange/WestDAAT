import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/footer.scss';

interface SiteFooterProps {
  showFeedbackModal(show: boolean): void;
}

function SiteFooter(props: SiteFooterProps) {

  return (
    <Navbar className="footer" variant="dark">
      <Container fluid className="ms-2 me-2">
        <div className="px-5">
          <Nav>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/">WaDE</Nav.Link>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/">WSWC</Nav.Link>
          </Nav>
        </div>

        <div>
          <Nav>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/westdaat-faq/">FAQ</Nav.Link>
            <button type="button" className="p-0 btn btn-text-color" onClick={() => props.showFeedbackModal(true)}>  Feedback </button>
          </Nav>
        </div>

      </Container>
    </Navbar>
  );
}

export default SiteFooter;
