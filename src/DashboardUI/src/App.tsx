import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import SideDetailsPage from "./pages/SiteDetailsPage";
import AppProvider from "./AppProvider";
import MapProvider from "./components/MapProvider";
import { ToastContainer } from "react-toastify";

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient();
  

  return (
    <>
    <AppProvider>
      <MapProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="site-details" element={<SideDetailsPage />} />
            </Route>
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
        </QueryClientProvider>
      </MapProvider>
    </AppProvider>
    </>
  );
}

export default App;
