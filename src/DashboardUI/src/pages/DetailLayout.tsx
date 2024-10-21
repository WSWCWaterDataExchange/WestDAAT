import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/detail-layout.scss';
import SiteFooter from '../components/SiteFooter';
import { useState } from 'react';
import SiteNavbar from '../components/SiteNavbar';
import FeedbackModal from '../components/FeedbackModal';

// TODO: Do we need logic to redirect if we don't have detail type or detail id in route?

function DetailLayout() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const shouldShowFeedbackModal = (show: boolean) => {
    setShowFeedbackModal(show);
  };

  return (
    <>
      <div className="detail-layout d-flex flex-column">
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}

        {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
        <SiteNavbar />
        <Outlet />
        <SiteFooter showFeedbackModal={shouldShowFeedbackModal} />
      </div>
      <FeedbackModal
        show={showFeedbackModal}
        setShow={shouldShowFeedbackModal}
      />
    </>
  );
}

export default DetailLayout;
