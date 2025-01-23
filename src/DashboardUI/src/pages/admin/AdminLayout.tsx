import React from 'react';
import SiteNavbar from '../../components/SiteNavbar';
import SiteFooter from '../../components/SiteFooter';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="d-flex flex-column">
      <SiteNavbar />

      <Outlet />

      <SiteFooter showFeedbackModal={() => {}} />
    </div>
  );
}
