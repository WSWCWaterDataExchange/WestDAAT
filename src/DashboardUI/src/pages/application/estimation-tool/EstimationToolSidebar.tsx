import { Container } from 'react-bootstrap';
import MapTheme from '../../../components/home-page/water-rights-tab/map-options/components/MapTheme';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export function EstimationToolSidebar() {
  return (
    <div className="position-relative flex-grow-1 panel-content">
      <Container fluid>
        <NotImplementedPlaceholder />

        <MapTheme />
      </Container>
    </div>
  );
}
