import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

interface EstimationToolNavbarProps {
  navigateToWaterRightLandingPage: () => void;
}

export function EstimationToolNavbar(props: EstimationToolNavbarProps) {
  return (
    <Navbar className="p-0 second-nav estimate-tool-navbar">
      <Container fluid>
        <Nav>
          <Nav.Item onClick={props.navigateToWaterRightLandingPage}>
            <Nav.Link as="button" className="text-dark">
              <div className="d-flex flex-row align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                Back to Water Right Landing Page
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand>WSWC</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
