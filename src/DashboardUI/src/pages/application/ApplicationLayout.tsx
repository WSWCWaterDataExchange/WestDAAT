import SiteNavbar from '../../components/SiteNavbar';
import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/SiteFooter';
import { ConservationApplicationProvider } from '../../contexts/ConservationApplicationProvider';
import MapProvider from '../../contexts/MapProvider';
import './ApplicationLayout.scss';

export function ApplicationLayout() {
  return (
    <div className="d-flex flex-column h-100">
      <SiteNavbar />

      <div className="application-layout flex-grow-1 overflow-hidden">
        <ConservationApplicationProvider>
          <MapProvider>
            <Outlet />
          </MapProvider>
        </ConservationApplicationProvider>
      </div>

      <SiteFooter />
    </div>
  );
}
