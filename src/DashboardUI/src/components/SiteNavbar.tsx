import { IPublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MenuIcon from 'mdi-react/MenuIcon';

import { SignIn } from './SignIn';

import '../styles/navbar.scss';
import { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useAuthenticationContext } from '../hooks/useAuthenticationContext';
import { Link } from 'react-router-dom';
import AuthorizedTemplate from './AuthorizedTemplate';
import { Role } from '../config/role';
import { getUserOrganization, hasUserRole } from '../utilities/securityHelpers';
import { isFeatureEnabled } from '../config/features';

function handleLogout(msalContext: IPublicClientApplication | null) {
  if (!msalContext) return;
  msalContext.logoutRedirect().catch((e) => {
    console.error(e);
  });
}

function SiteNavbar() {
  const { instance: msalContext } = useMsal();
  const { user } = useAuthenticationContext();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  const handleClose = () => setShowHamburgerMenu(false);
  const handleShow = () => setShowHamburgerMenu(true);

  const userOrganizationId = getUserOrganization(user);
  const showAdmin = isFeatureEnabled('conservationEstimationTool');
  const isGlobalAdmin = hasUserRole(user, Role.GlobalAdmin);

  const showOrganizationDashboard =
    isFeatureEnabled('conservationEstimationTool') && (userOrganizationId != null || isGlobalAdmin);

  const showProfileEdit = isFeatureEnabled('conservationEstimationTool');

  return (
    <div className="d-print-none">
      <Navbar variant="dark" expand={false}>
        <Container fluid>
          <div className="d-flex">
            <Button variant="link" onClick={handleShow} aria-label="Menu">
              <MenuIcon />
            </Button>

            <Nav className="mx-2">
              <Nav.Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://westernstateswater.org/wade/"
                active={false}
              >
                <img alt="Wade Logo" src="/logo32x32.png" />
                Water Data Exchange (WaDE) Program
              </Nav.Link>
            </Nav>
          </div>

          <Nav className="mx-2">
            <Nav.Link href="/" active={false}>
              Western States Water Data Access and Analysis Tool (WestDAAT)
            </Nav.Link>
          </Nav>

          <Nav className="mx-2">
            <UnauthenticatedTemplate>
              <Nav.Link active={false}>
                <SignIn />
              </Nav.Link>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
              <NavDropdown title={user?.emailAddress ?? 'My Account'}>
                {showProfileEdit && (
                  <NavDropdown.Item as={Link} to="/account">
                    My Account
                  </NavDropdown.Item>
                )}
                {showOrganizationDashboard && (
                  <NavDropdown.Item as={Link} to="/application/organization/dashboard">
                    Application Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={() => handleLogout(msalContext)}>Logout</NavDropdown.Item>
              </NavDropdown>
            </AuthenticatedTemplate>
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={showHamburgerMenu} onHide={handleClose} className="ham-menu">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <Nav defaultActiveKey="/" className="flex-column gap(10px)">
            <Nav.Link as={Link} to="/">
              WestDAAT Home
            </Nav.Link>
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/about ">
              About
            </Nav.Link>
            <Nav.Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://westernstateswater.org/wade/wade-data-summary/"
            >
              WaDE Water Data Summary
            </Nav.Link>
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/contact-us">
              Contact Us
            </Nav.Link>
            <Nav.Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://westernstateswater.org/wade/westdaat-terms-of-service/"
            >
              Terms of Service
            </Nav.Link>
            {showAdmin && (
              <>
                <AuthorizedTemplate roles={[Role.GlobalAdmin]}>
                  <Nav.Link as={Link} to="/admin/organizations">
                    Admin
                  </Nav.Link>
                </AuthorizedTemplate>
                <AuthorizedTemplate roles={[Role.OrganizationAdmin]}>
                  {userOrganizationId && (
                    <Nav.Link as={Link} to={`/admin/${userOrganizationId}/users`}>
                      Admin
                    </Nav.Link>
                  )}
                </AuthorizedTemplate>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SiteNavbar;
