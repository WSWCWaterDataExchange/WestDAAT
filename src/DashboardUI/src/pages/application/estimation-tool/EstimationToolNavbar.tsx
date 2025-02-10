import { Container, Nav, Navbar } from 'react-bootstrap';

interface EstimationToolNavbarProps {
  navigateToWaterRightLandingPage: () => void;
}

export function EstimationToolNavbar(props: EstimationToolNavbarProps) {
  return (
    <Navbar className="p-0 second-nav estimate-tool-navbar">
      <Container fluid className="p-0">
        <Nav>
          <Nav.Link onClick={props.navigateToWaterRightLandingPage}>Back to Water Right Landing Page</Nav.Link>
        </Nav>
        <Navbar.Brand>WSWC</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
