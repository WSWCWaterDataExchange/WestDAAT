import SiteNavbar from '../../components/SiteNavbar';
import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/SiteFooter';
import { AdminProvider } from '../../contexts/AdminProvider';

export function AdminLayout() {
  return (
    <div className="d-flex flex-column h-100">
      <SiteNavbar />

      <div className="flex-grow-1 mx-4 mt-4">
        <AdminProvider>
          <main>
            <Outlet />
          </main>
        </AdminProvider>
      </div>

      <SiteFooter />
    </div>
  );
}
