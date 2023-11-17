import { useState } from "react";
import { Outlet } from "react-router-dom";
import DisclaimerModal from "../components/DisclaimerModal";

function Layout() {
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(!localStorage.getItem("disclaimer"));

  const acceptDisclaimer = (today: Date) => {
    localStorage.setItem("disclaimer", today.toUTCString());
    setShowDisclaimerModal(false);
  }

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