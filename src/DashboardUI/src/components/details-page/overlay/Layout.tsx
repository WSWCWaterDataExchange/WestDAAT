import React from 'react';
import { DetailsPage } from '../DetailsPageLayout';
import OverlayProperties from './OverlayProperties';
import OverlayMap from './OverlayMap';
import OverlayAgency from './OverlayAgency';

import { useAlerts } from './hooks/useAlerts';
import './overlay.scss';
import WaterRightTabs from '../water-right/WaterRightTabs';
import OverlayTabs from './OverlayTabs';

export function Layout() {
  useAlerts();

  return (
    <DetailsPage>
      <DetailsPage.Header>WaDE Overlay Landing Page</DetailsPage.Header>

      <DetailsPage.Properties>
        <div>
          <OverlayProperties />
          <OverlayAgency />
        </div>
      </DetailsPage.Properties>

      <DetailsPage.Map>
        <OverlayMap />
      </DetailsPage.Map>

      <DetailsPage.Tabs>
        <OverlayTabs />
      </DetailsPage.Tabs>
    </DetailsPage>
  );
}
