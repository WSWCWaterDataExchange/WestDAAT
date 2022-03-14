import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/footer.scss';

function SiteFooter() {
  return (
    <Navbar className="footer" variant="dark">
      <Container fluid className="ms-2 me-2">
        <div>
          <Nav>
            <Nav.Link className="p-0" target="_blank" href="#">License Name</Nav.Link>
            <Nav.Link className="p-0" target="_blank" href="#">{new Date().getFullYear()}</Nav.Link>
            <Nav.Link className="p-0" target="_blank" href="#">Contact Us</Nav.Link>
            <Nav.Link className="p-0" target="_blank" href="https://westernstateswater.org/wade/">WaDE</Nav.Link>
            <Nav.Link className="p-0" target="_blank" href="https://westernstateswater.org/">WSWC</Nav.Link>
          </Nav>
        </div>

        <div>
          <Nav>
            <Nav.Link className="p-0" target="_blank"  href="#">FAQ</Nav.Link>
            <Nav.Link className="p-0" target="_blank"  href="#">Feedback</Nav.Link>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default SiteFooter;
