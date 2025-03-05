import React from 'react';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DisclaimerModal from '../components/DisclaimerModal';
import { useUserProfile } from '../hooks/queries/useUserQuery';
import { isFeatureEnabled } from '../config/features';

function Layout() {
  const { data: userProfileResponse } = useUserProfile();
  const navigate = useNavigate();

  // Force the user to complete their profile if they haven't already
  const isProfileEnabled = isFeatureEnabled('conservationEstimationTool');
  const requiresSignup = userProfileResponse?.userProfile.isSignupComplete === false;
  if (isProfileEnabled && requiresSignup) {
    setTimeout(() => {
      navigate('/account/signup');
    }, 0);
  }

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(!localStorage.getItem('disclaimer'));

  const acceptDisclaimer = (today: Date) => {
    localStorage.setItem('disclaimer', today.toUTCString());
    setShowDisclaimerModal(false);
  };

  return (
    <>
      <DisclaimerModal show={showDisclaimerModal} acceptDisclaimer={acceptDisclaimer} />

      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </>
  );
}

export default Layout;
