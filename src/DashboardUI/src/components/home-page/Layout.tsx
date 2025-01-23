import React from 'react';
import { useMemo } from 'react';
import SiteFooter from '../SiteFooter';
import { WaterRightsTab } from './water-rights-tab/map-options/components/WaterRightsTab';
import { useHomePageContext } from './Provider';
import './home-page.scss';
import SiteNavbar, { SiteActionbar } from '../SiteNavbar';

export function Layout() {
  const { downloadModal, setShowDownloadModal, uploadModal, setShowUploadModal } = useHomePageContext();

  const currentTabElement = useMemo(() => {
    return <WaterRightsTab />;
  }, []);

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar />
      <SiteActionbar showDownloadModal={setShowDownloadModal} showUploadModal={setShowUploadModal} />

      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">{currentTabElement}</div>

      <SiteFooter />

      {downloadModal}
      {uploadModal}
    </div>
  );
}
