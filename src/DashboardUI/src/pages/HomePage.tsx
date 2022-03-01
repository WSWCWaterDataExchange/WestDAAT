import { useEffect, useState } from 'react';
import ContactModal from '../components/ContactModal';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import Map from '../components/Map';

import '../styles/home-page.scss';
import { useSearchParams } from 'react-router-dom';

export enum HomePageTab {
  WaterRights = "Water Rights",
  Aggregations = "Aggregations",
  SiteSpecific = "Site Specific"
}

function HomePage() {

  let [urlParams, setUrlParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);
  const [showContactModal, setShowContactModal] = useState(false);


  const handleTabClick = (tab: HomePageTab) => {
    setUrlParams({ ...urlParams, tab});
  }

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  useEffect(() => {
    const tab = urlParams.get("tab")
    if(tab) {
      setCurrentTab(tab as HomePageTab);
    }
  })

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={handleTabClick} currentTab={currentTab} showContactModal={shouldShowContactModal} />
      <div className="d-flex flex-grow-1">
        <SidePanel currentTab={currentTab} />
        <div className="flex-grow-1">
          <Map currentTab={currentTab} />
        </div>
      </div>

      <SiteFooter />

      <ContactModal show={showContactModal} setShow={shouldShowContactModal} />
    </div>
  );
}

export default HomePage;
