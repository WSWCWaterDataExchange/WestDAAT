import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './../styles/side-panel.scss';
import { HomePageTab } from '../pages/HomePage';
import WaterRightsTab from './WaterRightsTab';
import AggregationsTab from './AggregationsTab';
import SiteSpecificTab from './SiteSpecificTab';

interface SidePanelProps {
  currentTab: HomePageTab;
}

function SidePanel(props: SidePanelProps) {

  var tabComponent = props.currentTab === HomePageTab.WaterRights ? <WaterRightsTab />
    : props.currentTab === HomePageTab.Aggregations ? <AggregationsTab />
      : <SiteSpecificTab />;

  return (
    <div className="side-panel">
      <div className="map-info text-center p-2">
        19,241 Points of Diversions Displayed
      </div>
      <div className="p-3">
        {tabComponent}
      </div>
    </div>
  );
}

export default SidePanel;
