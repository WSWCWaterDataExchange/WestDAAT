import React from 'react';
import { useMemo } from 'react';
import SiteFooter from '../SiteFooter';
import { WaterRightsTab } from './water-rights-tab/map-options/components/WaterRightsTab';
import { useHomePageContext } from './Provider';
import './home-page.scss';
import SiteNavbar from '../SiteNavbar';

export function Layout() {
  const { downloadModal, setShowDownloadModal, uploadModal, setShowUploadModal } = useHomePageContext();

  const currentTabElement = useMemo(() => {
    return <WaterRightsTab showDownloadModal={setShowDownloadModal} showUploadModal={setShowUploadModal} />;
  }, [setShowDownloadModal, setShowUploadModal]);

  return (
    <main className="home-page d-flex flex-column">
      <SiteNavbar />
      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">{currentTabElement}</div>
      <SiteFooter />
      {downloadModal}
      {uploadModal}
    </main>
  );
}
