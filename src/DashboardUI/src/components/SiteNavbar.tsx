import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { HomePageTab } from '../pages/HomePage';
import '../styles/navbar.scss';

interface SiteNavbarProps {
  currentTab: HomePageTab;
  onTabClick: (tab: HomePageTab) => void;
}

function SiteNavbar(props: SiteNavbarProps) {
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

      <Navbar bg="light" className="p-0">
        <Container fluid className="p-0">
          <Nav>
            {(Object.values(HomePageTab)).map(tab =>
              <Nav.Link onClick={() => props.onTabClick(tab)} className={`py-3 px-4 ${props.currentTab === tab ? 'active-tab' : ''}`}>
                {tab}
              </Nav.Link>
            )}
          </Nav>

          <div className="mx-2">
            <Button className="ms-1">View Table Results</Button>
            <Button className="ms-1">Download Data</Button>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default SiteNavbar;
