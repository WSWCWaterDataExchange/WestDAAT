import React from 'react';
import { HomePageProvider } from '../components/home-page/Provider';
import { Layout } from '../components/home-page/Layout';

function HomePage() {
  return (
    <HomePageProvider>
      <Layout />
    </HomePageProvider>
  );
}

export default HomePage;
