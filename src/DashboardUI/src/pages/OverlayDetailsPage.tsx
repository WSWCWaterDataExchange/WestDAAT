import React from 'react';
import { Layout } from '../components/details-page/overlay/Layout';
import { OverlayDetailsProvider } from '../components/details-page/overlay/Provider';

function OverlayDetailsPage() {
  return (
    <OverlayDetailsProvider>
      <Layout />
    </OverlayDetailsProvider>
  );
}

export default OverlayDetailsPage;
