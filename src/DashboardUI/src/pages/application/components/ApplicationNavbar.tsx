import { mdiArrowLeft, mdiWater } from '@mdi/js';
import Icon from '@mdi/react';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/esm/Navbar';

import './application-navbar.scss';

interface ApplicationNavbarProps {
  navigateBack: () => void;
  backButtonText: string;
  centerText: string;
}

export function ApplicationNavbar(props: ApplicationNavbarProps) {
  return (
    <Navbar className="application-navbar p-0">
      <div className="container-fluid">
        <Nav>
          <Nav.Item onClick={props.navigateBack}>
            {/* render as <button> instead of <a role="button"> */}
            <Nav.Link as="button" className="text-dark">
              <div className="d-flex align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                <span>{props.backButtonText}</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand>
          <div className="d-flex align-items-center gap-2">
            <Icon path={mdiWater} size="1.25em" className="application-water-icon" />
            <span className="fw-bold">{props.centerText}</span>
          </div>
        </Navbar.Brand>

        <Nav>{/* placeholder element for flexbox alignment */}</Nav>
      </div>
    </Navbar>
  );
}
