import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import SideDetailsPage from "./pages/SiteDetailsPage";

import './App.scss';
import AppProvider from "./AppProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="site-details" element={<SideDetailsPage />} />
          </Route>
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
