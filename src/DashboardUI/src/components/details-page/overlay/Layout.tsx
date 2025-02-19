import React from 'react';
import { DetailsPage } from '../DetailsPageLayout';
import OverlayProperties from './OverlayProperties';
import OverlayMap from './OverlayMap';
import OverlayAgency from './OverlayAgency';
import OverlayTabs from './OverlayTabs';
import OverlayHeader from './OverlayHeader';
import { useAlerts } from './hooks/useAlerts';

import './overlay.scss';

export function Layout() {
  useAlerts();

  return (
    <DetailsPage>
      <DetailsPage.Header>
        <OverlayHeader />
      </DetailsPage.Header>

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
