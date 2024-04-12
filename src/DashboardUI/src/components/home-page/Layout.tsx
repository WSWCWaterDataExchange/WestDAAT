import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../SiteFooter";
import SiteNavbar from "../SiteNavbar";
import FeedbackModal from "../FeedbackModal";
import { WaterRightsTab } from "./water-rights-tab/WaterRightsTab";
import { useHomePageContext } from "./Provider";
import { HomePageTab } from "../../pages/HomePage";

export function Layout() {
  const { downloadModal, setShowDownloadModal } = useHomePageContext();
  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const shouldShowFeedbackModal = (show: boolean) => {
    setShowFeedbackModal(show);
  };

  useEffect(() => {
    document.title = `WestDAAT - ${currentTab}`;
  }, [currentTab]);

  const currentTabElement = useMemo(() => {
    return <WaterRightsTab />;
  }, []);

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={setCurrentTab} currentTab={currentTab} showDownloadModal={setShowDownloadModal} />
      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">{currentTabElement}</div>
      <SiteFooter showFeedbackModal={shouldShowFeedbackModal} />
      <FeedbackModal show={showFeedbackModal} setShow={shouldShowFeedbackModal} />
      {downloadModal}
    </div>
  );
}
