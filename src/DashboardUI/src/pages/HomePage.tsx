import React from 'react';
import { HomePageProvider } from '../components/home-page/Provider';
import { Layout } from '../components/home-page/Layout';

export enum HomePageTab {
  WaterRights = 'Water Rights Data',
}

function HomePage() {
  return (
    <HomePageProvider>
      <Layout />
    </HomePageProvider>
  );
}

export default HomePage;
