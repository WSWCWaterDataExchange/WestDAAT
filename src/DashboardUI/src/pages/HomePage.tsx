import { useContext, useEffect, useRef, useState } from 'react';
import ContactModal from '../components/ContactModal';
import Map from '../components/Map';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';
import TermsModal from '../components/TermsModal';
import FeedbackModal from '../components/FeedbackModal';
import DownloadModal from '../components/DownloadModal';
import { Offcanvas, ProgressBar } from 'react-bootstrap';
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const containerRef = useRef(null);

  const shouldShowContactModal = (show: boolean) => {
    setShowContactModal(show);
  }

  const shouldShowTermsModal = (show: boolean) => {
    setShowTermsModal(show);
  }

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
        showContactModal={shouldShowContactModal}
        showTermsModal={shouldShowTermsModal}
        showDownloadModal={shouldShowDownloadModal}
      />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <SidePanel currentTab={currentTab} />
        <div className="flex-grow-1" ref={containerRef}>
          <Map />               
          {/* <div className="position-relative h-100"> */}
            <TableView containerRef={containerRef} />
          {/* </div> */}
        </div>        
      </div>      

      <SiteFooter
        showFeedbackModal={shouldShowFeedbackModal}
      />

      <ContactModal show={showContactModal} setShow={shouldShowContactModal} />
      <TermsModal show={showTermsModal} setShow={shouldShowTermsModal} />
      <FeedbackModal show={showFeedbackModal} setShow={shouldShowFeedbackModal} />
      <DownloadModal show={showDownloadModal} setShow={shouldShowDownloadModal} />
    </div>
  );
}

export default HomePage;
