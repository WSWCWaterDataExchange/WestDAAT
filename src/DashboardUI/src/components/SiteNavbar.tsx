import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import '../styles/navbar.scss';

function SiteNavbar() {
  return (
    <div>
      <Navbar variant="dark" expand={false}>
        <Container fluid>
          <div>
            <Button className="navbar-toggler visible">
              <span className="navbar-toggler-icon"></span>
            </Button>
            <span className="p-2">Western States Water Council</span>
          </div>

          <span>Water Data Exchange Data (WaDE) Dashboard</span>

          <Nav className="me-2">
            <Nav.Link href="#" active>Log In</Nav.Link>
          </Nav>
        </Container>

      </Navbar>

      <Navbar bg="light">
        <Container fluid>
          <Nav className="tabs">
            <Nav.Link href="#">Water Rights</Nav.Link>
            <Nav.Link href="#">Aggregations</Nav.Link>
            <Nav.Link href="#">Site Specific</Nav.Link>
          </Nav>

          <div>
            <Button className="ms-1">View Table Results</Button>
            <Button className="ms-1">Download Data</Button>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default SiteNavbar;
