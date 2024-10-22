import React from 'react';
import { Layout } from '../components/details-page/site/Layout';
import { SiteDetailsProvider } from '../components/details-page/site/Provider';

function SiteDetailsPage() {
  return (
    <SiteDetailsProvider>
      <Layout />
    </SiteDetailsProvider>
  );
}

export default SiteDetailsPage;
