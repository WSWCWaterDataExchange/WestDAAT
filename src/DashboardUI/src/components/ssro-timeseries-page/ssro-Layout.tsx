import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../SiteFooter";
import SiteNavbar from "../SiteNavbar";
import FeedbackModal from "../FeedbackModal";
import { SiteSpecificTab } from "./site-specific-ro-tab/SiteSpecificROTab";
import { useSiteSpecificPageContext } from "./ssro-Provider";
import { SiteSpecificROTab } from "../../pages/SiteSpecificROPage";
import "./ssro-timeseries-page.scss";

export function Layout() {
  const { downloadModal, setShowDownloadModal } = useSiteSpecificPageContext();
  const [currentTab, setCurrentTab] = useState(SiteSpecificROTab.SiteSpecific);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const shouldShowFeedbackModal = (show: boolean) => {
    setShowFeedbackModal(show);
  };

  useEffect(() => {
    document.title = `WestDAAT - ${currentTab}`;
  }, [currentTab]);

  const currentTabElement = useMemo(() => {
    return <SiteSpecificTab />;
  }, []);

  return (
    <div className="site-specific-page d-flex flex-column">
      <SiteNavbar onTabClickSS={setCurrentTab} currentTabSS={currentTab} showDownloadModal={setShowDownloadModal} />

      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">{currentTabElement}</div>

      <SiteFooter showFeedbackModal={shouldShowFeedbackModal} />

      <FeedbackModal show={showFeedbackModal} setShow={shouldShowFeedbackModal} />
      {downloadModal}
    </div>
  );
}
