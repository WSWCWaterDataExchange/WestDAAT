import React from 'react';
import SiteNavbar from '../../components/SiteNavbar';
import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/SiteFooter';

export function AdminLayout() {
  return (
    <div className="d-flex flex-column h-100">
      <SiteNavbar />

      <div className="flex-grow-1">
        <Outlet />
      </div>

      <SiteFooter />
    </div>
  );
}
