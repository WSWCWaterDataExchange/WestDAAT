import React from 'react';
import { DetailsPage } from '../DetailsPageLayout';
import SiteMap from './SiteMap';
import SiteProperties from './SiteProperties';
import SiteTabs from './SiteTabs';
import DetailsLineChart from './DetailsLineChart';
import { useAlerts } from './hooks/useAlerts';
import SiteHeader from './SiteHeader';

import './site.scss';

export function Layout() {
  useAlerts();
  return (
    <DetailsPage>
      <DetailsPage.Header>
        <SiteHeader />
      </DetailsPage.Header>
      <DetailsPage.Properties>
        <SiteProperties />
      </DetailsPage.Properties>
      <DetailsPage.Map>
        <SiteMap />
      </DetailsPage.Map>
      <DetailsPage.Tabs>
        <SiteTabs />
      </DetailsPage.Tabs>
      <DetailsPage.LineChart>
        <DetailsLineChart />
      </DetailsPage.LineChart>
    </DetailsPage>
  );
}
