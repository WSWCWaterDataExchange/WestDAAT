import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import SiteFooter from '../SiteFooter';
import SiteNavbar from '../SiteNavbar';
import FeedbackModal from '../FeedbackModal';
import { WaterRightsTab } from './water-rights-tab/WaterRightsTab';
import { useHomePageContext } from './Provider';
import './home-page.scss';

export function Layout() {
  const { downloadModal, setShowDownloadModal, uploadModal, setShowUploadModal } = useHomePageContext();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const shouldShowFeedbackModal = (show: boolean) => {
    setShowFeedbackModal(show);
  };

  const currentTabElement = useMemo(() => {
    return <WaterRightsTab />;
  }, []);

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar showDownloadModal={setShowDownloadModal} showUploadModal={setShowUploadModal} />

      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">{currentTabElement}</div>

      <SiteFooter showFeedbackModal={shouldShowFeedbackModal} />

      <FeedbackModal show={showFeedbackModal} setShow={shouldShowFeedbackModal} />
      {downloadModal}
      {uploadModal}
    </div>
  );
}
