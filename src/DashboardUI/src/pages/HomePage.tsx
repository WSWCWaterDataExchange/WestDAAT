import { useEffect, useState } from 'react';
import ContactModal from '../components/ContactModal';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import Map from '../components/Map';

import '../styles/home-page.scss';
import { useParams, useSearchParams } from 'react-router-dom';

export enum HomePageTab {
  WaterRights = "Water Rights",
  TempNldi = "Temp NLDI",
  Aggregations = "Aggregations",
  SiteSpecific = "Site Specific"
}

function HomePage() {

  let [urlParams, setUrlParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);
  const [showContactModal, setShowContactModal] = useState(false);


  const handleTabClick = (map: HomePageTab) => {
    let prevParams: any = {}
    urlParams.forEach((value, key) => {
      prevParams[key] = value;
    });

    setUrlParams({ ...prevParams, map });
  }

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  useEffect(() => {
    const tabParam = urlParams.get("map")
    if (tabParam) {
      const tab = tabParam as HomePageTab;
      setCurrentTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams])

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={handleTabClick} currentTab={currentTab} showContactModal={shouldShowContactModal} />
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
