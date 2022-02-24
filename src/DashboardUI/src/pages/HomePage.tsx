import { useState } from 'react';
import ContactModal from '../components/ContactModal';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import Map from '../components/Map';

import '../styles/home-page.scss';

export enum HomePageTab {
  WaterRights = "Water Rights",
  Aggregations = "Aggregations",
  SiteSpecific = "Site Specific"
}

function HomePage() {

  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);
  const [showContactModal, setShowContactModal] = useState(false);


  const handleTabClick = (tab: HomePageTab) => {
    setCurrentTab(tab);
  }

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={handleTabClick} currentTab={currentTab} showContactModal={shouldShowContactModal} />
      <div className="d-flex flex-grow-1">
        <SidePanel currentTab={currentTab} />
        <div className="flex-grow-1">
          <Map />
        </div>
      </div>

      <SiteFooter />

      <ContactModal show={showContactModal} setShow={shouldShowContactModal} />
    </div>
  );
}

export default HomePage;
