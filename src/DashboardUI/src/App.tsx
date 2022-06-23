import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import DetailLayout from './pages/DetailLayout';
import DetailsPage from './pages/DetailsPage';
import AppProvider from "./AppProvider";
import MapProvider from "./components/MapProvider";
import { ToastContainer } from "react-toastify";
import { DndProvider } from 'react-dnd'
import { TouchBackend } from "react-dnd-touch-backend"; //We need to use the touch backend instead of HTML5 because drag and drop of the NLDI pin stops mouse events from raising

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useEffect, useState } from "react";
import ReactGA from 'react-ga';

export interface AppProps {
  msalInstance: IPublicClientApplication
}

function App({ msalInstance }: AppProps) {
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

  const [googleAnalyticsInitialized, setgoogleAnalyticsInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    //initialize Google Analytics
    if (process.env.REACT_APP_GA_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_ID);
      setgoogleAnalyticsInitialized(true);
    }
  }, []); //only run once

  useEffect(() => {
    if(googleAnalyticsInitialized){
      ReactGA.pageview(`${location.pathname}${location.search}`)
    }
  }, [googleAnalyticsInitialized, location])

  return (
    <MsalProvider instance={msalInstance}>
      <AppProvider>
        <MapProvider>
          <QueryClientProvider client={queryClient}>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="details" element={<DetailLayout />}>
                    <Route path="site/:id" element={<DetailsPage detailType={"site"} />} />
                    <Route path="right/:id" element={<DetailsPage detailType={"right"} />} />
                  </Route>
                </Route>
              </Routes>
              <ReactQueryDevtools initialIsOpen={false} />
              <ToastContainer />
            </DndProvider>
          </QueryClientProvider>
        </MapProvider>
      </AppProvider>
    </MsalProvider>
  );
}

export default App;
