import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import DetailLayout from './pages/DetailLayout';
import DetailsPage from './pages/DetailsPage';
import SideDetailsPage from "./pages/SiteDetailsPage";
import AppProvider from "./AppProvider";
import MapProvider from "./components/MapProvider";
import { ToastContainer } from "react-toastify";
import { DndProvider } from 'react-dnd'
import { TouchBackend } from "react-dnd-touch-backend"; //We need to use the touch backend instead of HTML5 because drag and drop of the NLDI pin stops mouse events from raising

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient();
  

  return (
    <>
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
                  <Route path="site-details" element={<SideDetailsPage />} />
                </Route>
              </Routes>
              <ReactQueryDevtools initialIsOpen={false} />
              <ToastContainer />
            </DndProvider>
          </QueryClientProvider>
        </MapProvider>
      </AppProvider>
    </>
  );
}

export default App;
