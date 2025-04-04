import { mdiArrowLeft, mdiWater } from '@mdi/js';
import Icon from '@mdi/react';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/esm/Navbar';
import Placeholder from 'react-bootstrap/esm/Placeholder';

import './application-navbar.scss';

interface ApplicationNavbarProps {
  navigateBack: () => void;
  backButtonText: string;
  centerText: string;
  centerTextIsLoading: boolean;
  displayWaterIcon: boolean;
}

export function ApplicationNavbar(props: ApplicationNavbarProps) {
  return (
    <Navbar className="application-navbar p-0">
      <div className="container-fluid">
        <Nav>
          <Nav.Item onClick={props.navigateBack}>
            {/* render as <button> instead of <a role="button"> */}
            <Nav.Link as="button" className="text-dark d-print-none">
              <div className="d-flex align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                <span>{props.backButtonText}</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand>
          <div className="d-flex align-items-center gap-2">
            {props.centerTextIsLoading ? (
              <>
                <Placeholder animation="glow">
                  <Placeholder xs={12} className="rounded" style={{ width: '200px' }} />
                </Placeholder>
              </>
            ) : (
              <>
                {props.displayWaterIcon && <Icon path={mdiWater} size="1.25em" className="application-water-icon" />}
                <span className="fw-bold">{props.centerText}</span>
              </>
            )}
          </div>
        </Navbar.Brand>

        <Nav>{/* placeholder element for flexbox alignment */}</Nav>
      </div>
    </Navbar>
  );
}
