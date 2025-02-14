import { mdiArrowLeft, mdiWater } from '@mdi/js';
import Icon from '@mdi/react';
import { Nav, Navbar } from 'react-bootstrap';

interface EstimationToolNavbarProps {
  navigateToWaterRightLandingPage: () => void;
}

export function EstimationToolNavbar(props: EstimationToolNavbarProps) {
  return (
    <Navbar className="estimate-tool-navbar p-0">
      <div className="container-fluid">
        <Nav>
          <Nav.Item onClick={props.navigateToWaterRightLandingPage}>
            {/* render as <button> instead of <a role="button"> */}
            <Nav.Link as="button" className="text-dark">
              <div className="d-flex align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                <span>Back to Water Right Landing Page</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand>
          <div className="d-flex align-items-center gap-2">
            <Icon path={mdiWater} size="1.25em" className="water-icon" />
            <span>Water Conservation Estimation Tool</span>
          </div>
        </Navbar.Brand>

        <Nav>{/* placeholder element for flexbox alignment */}</Nav>
      </div>
    </Navbar>
  );
}
