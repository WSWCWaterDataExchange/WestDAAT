import MapTheme from '../../../components/home-page/water-rights-tab/map-options/components/MapTheme';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export function EstimationToolSidebar() {
  return (
    <div className="position-relative flex-grow-1 panel-content">
      <div className="container-fluid">
        <NotImplementedPlaceholder />

        <MapTheme />
      </div>
    </div>
  );
}
