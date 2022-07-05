import { useContext, useEffect, useRef, useState } from 'react';
import Map from '../components/Map';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import FeedbackModal from '../components/FeedbackModal';
import DownloadModal from '../components/DownloadModal';
import TableView from '../components/TableView';

import '../styles/home-page.scss';
import { AppContext } from '../AppProvider';

export enum HomePageTab {
  WaterRights = "Water Rights Data",
  Aggregations = "Aggregate Area Time Series Water Data",
  SiteSpecific = "Water Use Site-Specific Time Series Data"
}

function HomePage() {

  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const [currentTab, setCurrentTab] = useState(getUrlParam<HomePageTab>("tab") ?? HomePageTab.WaterRights);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const containerRef = useRef(null);

  const shouldShowFeedbackModal = (show: boolean) => {
    setShowFeedbackModal(show);
  }

  const shouldShowDownloadModal = (show: boolean) => {
    setShowDownloadModal(show);
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
      <SiteNavbar
        onTabClick={setCurrentTab}
        currentTab={currentTab}
        showDownloadModal={shouldShowDownloadModal}
      />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <SidePanel currentTab={currentTab} />
        <div className="flex-grow-1" ref={containerRef}>
          <Map />
          <TableView containerRef={containerRef} />
        </div>
      </div>

      <SiteFooter
        showFeedbackModal={shouldShowFeedbackModal}
      />

      <FeedbackModal show={showFeedbackModal} setShow={shouldShowFeedbackModal} />
      <DownloadModal show={showDownloadModal} setShow={shouldShowDownloadModal} />
    </div>
  );
}

export default HomePage;
