import React from 'react';
import { DetailsPage } from '../DetailsPageLayout';
import SiteMap from './SiteMap';
import SiteProperties from './SiteProperties';
import SiteTabs from './SiteTabs';
import { useAlerts } from './hooks/useAlerts';

import './site.scss';

export function Layout() {
  useAlerts();
  return (
    <DetailsPage>
      <DetailsPage.Header>WaDE Site Landing Page</DetailsPage.Header>
      <DetailsPage.Properties>
        <SiteProperties />
      </DetailsPage.Properties>
      <DetailsPage.Map>
        <SiteMap />
      </DetailsPage.Map>
      <DetailsPage.Tabs>
        <SiteTabs />
      </DetailsPage.Tabs>
    </DetailsPage>
  );
}
