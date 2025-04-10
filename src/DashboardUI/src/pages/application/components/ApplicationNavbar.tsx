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
  rightButtonDisplayed?: boolean;
  rightButtonText?: string;
  rightButtonIcon?: string;
  onRightButtonClick?: () => void;
}

export function ApplicationNavbar(props: ApplicationNavbarProps) {
  return (
    <Navbar className="application-navbar p-0">
      <div className="d-flex justify-content-between container-fluid">
        <Nav className="left">
          <Nav.Item onClick={props.navigateBack}>
            <Nav.Link as="button" className="text-dark d-print-none">
              <div className="d-flex align-items-center gap-2">
                <Icon path={mdiArrowLeft} size="1em" />
                <span>{props.backButtonText}</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar.Brand className="justify-self-center">
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

        <Nav className="right d-flex justify-content-end">
          {props.rightButtonDisplayed && (
            <Nav.Item onClick={props.onRightButtonClick}>
              <Nav.Link as="button" className="text-dark d-print-none">
                <div className="d-flex align-items-center gap-2">
                  <span>{props.rightButtonText}</span>
                  {props.rightButtonIcon && <Icon path={props.rightButtonIcon} size="1em" />}
                </div>
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </div>
    </Navbar>
  );
}
