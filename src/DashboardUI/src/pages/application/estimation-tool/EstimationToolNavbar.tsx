import { mdiArrowLeft, mdiWater } from '@mdi/js';
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
            {/* render as <button> instead of <a role="button"> */}
            <Nav.Link as="button" className="text-dark">
              <div className="d-flex flex-row align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                <span>Back to Water Right Landing Page</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand>
          <div className="d-flex flex-row align-items-center gap-2">
            <Icon path={mdiWater} size="1em" />
            <span>Water Conservation Estimation Tool</span>
          </div>
        </Navbar.Brand>

        <Nav>{/* placeholder element for flexbox alignment */}</Nav>
      </Container>
    </Navbar>
  );
}
