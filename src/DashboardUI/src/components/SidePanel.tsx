import { HomePageTab } from '../pages/HomePage';
import WaterRightsTab from './WaterRightsTab';
import AggregationsTab from './AggregationsTab';
import SiteSpecificTab from './SiteSpecificTab';

import './../styles/side-panel.scss';

interface SidePanelProps {
  currentTab: HomePageTab;
}

function SidePanel(props: SidePanelProps) {
  const tabs: Record<HomePageTab, JSX.Element> = {
    [HomePageTab.WaterRights]: <WaterRightsTab />,
    [HomePageTab.Aggregations]: <AggregationsTab />,
    [HomePageTab.SiteSpecific]: <SiteSpecificTab />
  }
  
  var tabComponent = tabs[props.currentTab];

  return (
    <div className="side-panel d-flex flex-column">
      {tabComponent}
    </div>
  );
}

export default SidePanel;
