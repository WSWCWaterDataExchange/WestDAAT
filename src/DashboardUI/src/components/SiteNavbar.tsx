import { IPublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MenuIcon from 'mdi-react/MenuIcon';

import { HomePageTab } from '../pages/HomePage';
import { SignIn } from "./SignIn";

import '../styles/navbar.scss';
import { useState } from 'react';
import { NavDropdown } from "react-bootstrap";
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";

interface SiteNavbarProps {
  currentTab?: HomePageTab;
  onTabClick?: (tab: HomePageTab) => void;
  showDownloadModal?: (show: boolean) => void;
}

function handleLogout(msalContext: IPublicClientApplication | null) {
  if (!msalContext) return;
  msalContext.logoutPopup()
    .catch(e => {
      console.error(e);
    });
}

function SiteNavbar({currentTab, onTabClick, showDownloadModal}: SiteNavbarProps = {}) {
  const { instance: msalContext } = useMsal();
  const { user } = useAuthenticationContext();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  const handleClose = () => setShowHamburgerMenu(false);
  const handleShow = () => setShowHamburgerMenu(true);

  return (
    <div>
      <Navbar variant="dark" expand={false}>
        <Container fluid>
          <div className="d-flex">
            <Button variant="link" onClick={handleShow}>
              <MenuIcon />
            </Button>

            <Nav className="mx-2">
              <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/" active={false}>
                <img alt="Wade Logo" src="/logo32x32.png" />
                  Water Data Exchange (WaDE) Program
              </Nav.Link>
            </Nav>
          </div>

          <Nav className="mx-2">
            <Nav.Link href="/" active={false}>Western States Water Data Access and Analysis Tool (WestDAAT)</Nav.Link>
          </Nav>

          <Nav className="mx-2">
            <UnauthenticatedTemplate>
              <Nav.Link active={false}>
                <SignIn />
              </Nav.Link>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
              <NavDropdown title={user?.emailAddress ?? 'My Account'}>
                <NavDropdown.Item onClick={() => handleLogout(msalContext)}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </AuthenticatedTemplate>
          </Nav>

        </Container>
      </Navbar>

      {onTabClick && showDownloadModal && currentTab &&
        <Navbar bg="light" className="p-0 second-nav">
          <Container fluid className="p-0">
            <Nav>
              {(Object.values(HomePageTab)).map(tab =>
                <Nav.Link onClick={() => onTabClick(tab)} className={`py-3 px-4 ${currentTab === tab ? 'active-tab' : ''}`} key={tab}>
                  {tab}
                </Nav.Link>
                )}
            </Nav>

            <div className="mx-2">
              <Button className="ms-1" onClick={() => showDownloadModal(true)}>Download Data</Button>
            </div>
          </Container>
        </Navbar>
      }

      <Offcanvas show={showHamburgerMenu} onHide={handleClose} className="ham-menu">
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav defaultActiveKey="/" className="flex-column gap(10px)">
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/about ">About</Nav.Link>
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/water-rights-data">Water Rights Data</Nav.Link>
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/contact-us">Contact Us</Nav.Link>
            <Nav.Link target="_blank" rel="noopener noreferrer" href="https://westernstateswater.org/wade/westdaat-terms-of-service/">Terms of Service</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SiteNavbar;
