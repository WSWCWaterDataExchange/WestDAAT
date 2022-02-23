import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/side-panel.scss';

function SidePanel() {
  return (
    <div className="side-panel">
      <div className="map-info text-center p-2">
        19,241 Points of Diversions Displayed
      </div>
    </div>
  );
}

export default SidePanel;
