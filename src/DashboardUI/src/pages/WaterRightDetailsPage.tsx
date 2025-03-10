import React from 'react';
import { Layout } from '../components/details-page/water-right/Layout';
import { WaterRightDetailsProvider } from '../components/details-page/water-right/Provider';

function WaterRightDetailsPage() {
  return (
    <WaterRightDetailsProvider>
      <Layout />
    </WaterRightDetailsProvider>
  );
}

export default WaterRightDetailsPage;
