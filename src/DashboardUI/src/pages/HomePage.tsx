import { useContext, useEffect, useState } from 'react';
import ContactModal from '../components/ContactModal';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import Map from '../components/Map';

import '../styles/home-page.scss';
import { useSearchParams } from 'react-router-dom';
import { MapContext, MapTypes } from '../components/MapProvider';

export enum HomePageTab {
  WaterRights = "Water Rights",
  Aggregations = "Aggregations",
  SiteSpecific = "Site Specific"
}

function HomePage() {

  const { setCurrentBaseMap } = useContext(MapContext);

  let [urlParams, setUrlParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);
  const [showContactModal, setShowContactModal] = useState(false);


  const handleTabClick = (map: HomePageTab) => {
    setUrlParams({ ...urlParams, map });
  }

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  useEffect(() => {
    const tabParam = urlParams.get("map")
    if (tabParam) {
      const tab = tabParam as HomePageTab;
      setCurrentTab(tab);
      setCurrentBaseMap(
        tab === HomePageTab.WaterRights
          ? MapTypes.WaterRights
          : MapTypes.Aggregate
      );
    }
  }, [urlParams, setCurrentBaseMap])

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
