import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/footer.scss';

function SiteFooter() {
  return (
    <Navbar className="footer" variant="dark">
      <Container fluid>
        <div>
          <Nav>
            <Nav.Link className="p-0" href="#">License Name</Nav.Link>
            <Nav.Link className="p-0" href="#">{new Date().getFullYear()}</Nav.Link>
            <Nav.Link className="p-0" href="#">Contact Us</Nav.Link>
            <Nav.Link className="p-0" href="#">WaDE</Nav.Link>
            <Nav.Link className="p-0" href="#">WSWC</Nav.Link>
          </Nav>
        </div>

        <div>
          <Nav>
            <Nav.Link className="p-0" href="#">FAQ</Nav.Link>
            <Nav.Link className="p-0" href="#">Feedback</Nav.Link>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default SiteFooter;
