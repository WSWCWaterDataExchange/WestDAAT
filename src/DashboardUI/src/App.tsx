import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import DetailLayout from './pages/DetailLayout';
import AppProvider from './contexts/AppProvider';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'; //We need to use the touch backend instead of HTML5 because drag and drop of the NLDI pin stops mouse events from raising

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import WaterRightDetailsPage from './pages/WaterRightDetailsPage';
import SiteDetailsPage from './pages/SiteDetailsPage';
import OverlayDetailsPage from './pages/OverlayDetailsPage';
import { clarity } from 'clarity-js';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminGuard } from './pages/admin/AdminGuard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { useAuthenticationContext } from './hooks/useAuthenticationContext';
import { AdminOrganizationsUsersPage } from './pages/admin/AdminOrganizationUsersPage';

export interface AppProps {
  msalInstance: IPublicClientApplication;
}

function App({ msalInstance }: AppProps) {
  const queryClient = new QueryClient();
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity,
    },
  });

  const [googleAnalyticsInitialized, setGoogleAnalyticsInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    //initialize Google Analytics
    if (process.env.REACT_APP_GA_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_ID);
      setGoogleAnalyticsInitialized(true);
    }
  }, [setGoogleAnalyticsInitialized]);

  useEffect(() => {
    if (googleAnalyticsInitialized) {
      ReactGA.send({
        hitType: 'pageview',
        page: `${location.pathname}${location.search}`,
      });
    }
  }, [googleAnalyticsInitialized, location]);

  useEffect(() => {
    if ((process.env.REACT_APP_CLARITY_ID?.length || 0) > 0) {
      clarity.start({
        projectId: process.env.REACT_APP_CLARITY_ID,
        upload: 'https://m.clarity.ms/collect',
        track: true,
        content: true,
      });
    }
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="details" element={<DetailLayout />}>
                  <Route path="site/:id" element={<SiteDetailsPage />} />
                  <Route path="right/:id" element={<WaterRightDetailsPage />} />
                  <Route path="overlay/:id" element={<OverlayDetailsPage />} />
                </Route>
                <Route path="admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route path="organizations" element={<AdminOrganizationsPage />} />
                    <Route path="users" element={<AdminOrganizationsUsersPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer containerId="app-toast-container" />
          </DndProvider>
        </QueryClientProvider>
      </AppProvider>
    </MsalProvider>
  );
}

export default App;
