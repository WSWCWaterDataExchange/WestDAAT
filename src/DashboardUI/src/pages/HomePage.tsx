import { useContext, useEffect, useState } from 'react';
import ContactModal from '../components/ContactModal';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import Map from '../components/Map';

import '../styles/home-page.scss';
import { AppContext } from '../AppProvider';

export enum HomePageTab {
  WaterRights = "Water Rights Data",
  TempNldi = "Temp NLDI",
  Aggregations = "Aggregate Area Time Series Water Data",
  SiteSpecific = "Water Use Site-Specific Time Series Data"
}

function HomePage() {

  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const [currentTab, setCurrentTab] = useState(getUrlParam<HomePageTab>("tab") ?? HomePageTab.WaterRights);
  const [showContactModal, setShowContactModal] = useState(false);

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  useEffect(() => {
    document.title = `WestDAAT - ${currentTab}`
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === HomePageTab.WaterRights) {
      setUrlParam("tab", undefined);
    } else {
      setUrlParam("tab", currentTab)
    }
  }, [currentTab, setUrlParam])

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={setCurrentTab} currentTab={currentTab} showContactModal={shouldShowContactModal} />
      <div className="d-flex flex-grow-1 overflow-hidden">
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
