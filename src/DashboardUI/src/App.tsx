import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { clarity } from 'clarity-js';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'; //We need to use the touch backend instead of HTML5 because drag and drop of the NLDI pin stops mouse events from raising
import ReactGA from 'react-ga4';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from './contexts/AppProvider';
import { AccountInformationPage } from './pages/account/AccountInformationPage';
import { AccountLayout } from './pages/account/AccountLayout';
import { AdminGuard } from './pages/admin/AdminGuard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminOrganizationsUsersPage } from './pages/admin/AdminOrganizationUsersPage';
import { ApplicationCreatePage } from './pages/application/create/ApplicationCreatePage';
import { AuthGuard } from './pages/application/AuthGuard';
import { ApplicationLayout } from './pages/application/ApplicationLayout';
import { EstimationToolPage } from './pages/application/estimation-tool/EstimationToolPage';
import { OrganizationDashboardPage } from './pages/application/dashboard/OrganizationDashboardPage';
import { SignupPage } from './pages/account/SignupPage';
import DetailLayout from './pages/DetailLayout';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import OverlayDetailsPage from './pages/OverlayDetailsPage';
import SiteDetailsPage from './pages/SiteDetailsPage';
import WaterRightDetailsPage from './pages/WaterRightDetailsPage';

import './App.scss';
import { ApplicationSubmitPage } from './pages/application/dashboard/ApplicationSubmitPage';
import ApplicationReviewPage from './pages/application/review/ApplicationReviewPage';
import { ApplicationReviewGuard } from './pages/application/review/ApplicationReviewGuard';

export interface AppProps {
  msalInstance: IPublicClientApplication;
}

const queryClient = new QueryClient();

function App({ msalInstance }: AppProps) {
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: 0,
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
                <Route path="account" element={<AuthGuard />}>
                  <Route element={<AccountLayout />}>
                    <Route index element={<AccountInformationPage />} />
                    <Route path="signup" element={<SignupPage />} />
                  </Route>
                </Route>
                <Route path="application" element={<AuthGuard />}>
                  <Route element={<ApplicationLayout />}>
                    <Route path="organization">
                      <Route path="dashboard" element={<OrganizationDashboardPage />} />
                    </Route>
                    <Route path=":applicationId">
                      <Route path="create" element={<ApplicationCreatePage />} />
                      <Route path="submit" element={<ApplicationSubmitPage />} />
                      <Route path="review" element={<ApplicationReviewGuard />}>
                        <Route index element={<ApplicationReviewPage />} />
                      </Route>
                    </Route>
                    <Route path=":waterRightNativeId/estimation" element={<EstimationToolPage />} />
                  </Route>
                </Route>
                <Route path="admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route path="organizations" element={<AdminOrganizationsPage />} />
                    <Route path=":organizationId/users" element={<AdminOrganizationsUsersPage />} />
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
