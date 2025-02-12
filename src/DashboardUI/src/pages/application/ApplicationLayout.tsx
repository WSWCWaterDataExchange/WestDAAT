import SiteNavbar from '../../components/SiteNavbar';
import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/SiteFooter';
import { ConservationApplicationProvider } from '../../contexts/ConservationApplicationProvider';

export function ApplicationLayout() {
  return (
    <div className="d-flex flex-column h-100">
      <SiteNavbar />

      <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">
        <ConservationApplicationProvider>
          <Outlet />
        </ConservationApplicationProvider>
      </div>

      <SiteFooter />
    </div>
  );
}
