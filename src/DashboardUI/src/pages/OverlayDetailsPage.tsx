import React from 'react';
import { Layout } from '../components/details-page/overlay/Layout';
import { OverlayDetailsProvider } from '../components/details-page/overlay/Provider';

function OverlayDetailsPage() {
  return (
    <OverlayDetailsProvider>
      <span>skibidi layout start</span>
      <Layout />
      <span>skibidi layout end</span>
    </OverlayDetailsProvider>
  );
}

export default OverlayDetailsPage;
