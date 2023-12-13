import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import DetailLayout from './pages/DetailLayout';
import AppProvider from "./contexts/AppProvider";
import { ToastContainer } from "react-toastify";
import { DndProvider } from 'react-dnd'
import { TouchBackend } from "react-dnd-touch-backend"; //We need to use the touch backend instead of HTML5 because drag and drop of the NLDI pin stops mouse events from raising

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useEffect, useState } from "react";
import ReactGA from 'react-ga4';
import WaterRightDetailsPage from "./pages/WaterRightDetailsPage";
import SiteDetailsPage from "./pages/SiteDetailsPage";
import TimeSeriesPage from "./pages/TimeSeriesPage";
import TimeSeriesMapPage from "./pages/TimeSeriesMapPage";
import TimeFullMap from "./components/details-page/timeseries/time-series-map/TimeFullMap";
import {SiteUUIDContext}   from "./components/details-page/timeseries/Context/SiteUUIDContext"
import APISearch from "./components/details-page/timeseries/APISearch";

export interface AppProps {
  msalInstance: IPublicClientApplication
}

function App({ msalInstance }: AppProps) {
  const initialSiteUUID: string | null = null;
  const queryClient = new QueryClient();
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    }
  })

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
      ReactGA.send({ hitType: 'pageview', page: `${location.pathname}${location.search}` });
    }
  }, [googleAnalyticsInitialized, location])

  const [storedSiteUUID, setStoredSiteUUID] = useState("");

  return (
    <MsalProvider instance={msalInstance}>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <SiteUUIDContext.Provider value={{storedSiteUUID,setStoredSiteUUID}}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="details" element={<DetailLayout />}>
                  <Route path="site/:id" element={<SiteDetailsPage />} />
                  <Route path="right/:id" element={<WaterRightDetailsPage />} />
                  <Route path="timeSeriesPage/:siteUUID" element={<TimeSeriesPage />} />
                  <Route path = "timeSeriesMap" element={<TimeSeriesMapPage/>}/>
                  <Route path = "timeFullMap" element={ <TimeFullMap/>}/>
                  <Route path = "apiSearch" element={ <APISearch/>}/>
                </Route>
              </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
            </SiteUUIDContext.Provider>
          </DndProvider>
        </QueryClientProvider>
      </AppProvider>
    </MsalProvider>
  );
}

export default App;
