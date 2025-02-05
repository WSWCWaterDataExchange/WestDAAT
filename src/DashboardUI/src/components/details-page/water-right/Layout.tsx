import React from 'react';
import { DetailsPage } from '../DetailsPageLayout';
import WaterRightMap from './WaterRightMap';
import WaterRightProperties from './WaterRightProperties';
import WaterRightTabs from './WaterRightTabs';
import { useAlerts } from './hooks/useAlerts';

import './water-right.scss';
import WaterRightHeader from './WaterRightHeader';

export function Layout() {
  useAlerts();
  return (
    <DetailsPage>
      <DetailsPage.Header>
        <WaterRightHeader />
      </DetailsPage.Header>
      <DetailsPage.Properties>
        <WaterRightProperties />
      </DetailsPage.Properties>
      <DetailsPage.Map>
        <WaterRightMap />
      </DetailsPage.Map>
      <DetailsPage.Tabs>
        <WaterRightTabs />
      </DetailsPage.Tabs>
    </DetailsPage>
  );
}
