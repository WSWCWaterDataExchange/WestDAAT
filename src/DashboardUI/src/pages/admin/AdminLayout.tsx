import React from 'react';
import SiteNavbar from '../../components/SiteNavbar';
import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/SiteFooter';

export function AdminLayout() {
  return (
    <div className="d-flex flex-column">
      <SiteNavbar />

      <Outlet />

      <SiteFooter />
    </div>
  );
}
