import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/footer.scss';
import github_mark_white from '../assets/github_mark_white.png'

interface SiteFooterProps {
  showFeedbackModal(show: boolean): void;
}

function SiteFooter(props: SiteFooterProps) {

  return (
    <Navbar className="footer" variant="dark">
      <Container fluid className="ms-3 me-3">
        <div className="px-5">
          <Nav>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/" active={false}>WaDE</Nav.Link>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/" active={false}>WSWC</Nav.Link>
            <Nav.Link className="p-0 s-1" target="_blank" rel="noopener noreferrer" href="https://github.com/WSWCWaterDataExchange/WestDAAT/" active={false}><img className="github-logo" src={github_mark_white} alt="GitHub logo with link to WestDAAT source code"/></Nav.Link>
          </Nav>
        </div>
        <div>
          <Nav>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/known-issues/" active={false}>Known Issues</Nav.Link>
          </Nav>
        </div>
        <div>
          <Nav>
            <Nav.Link className="p-0" target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/westdaat-faq/" active={false}>FAQ</Nav.Link>
            <Nav.Link role="button" className="p-0 btn btn-text-color" onClick={() => props.showFeedbackModal(true)} active={false}>Feedback</Nav.Link>
          </Nav>
        </div>

      </Container>
    </Navbar>
  );
}

export default SiteFooter;
