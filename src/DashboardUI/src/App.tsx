import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

import './App.scss';
import AppProvider from "./AppProvider";
import DetailLayout from './pages/DetailLayout';
import DetailsPage from './pages/DetailsPage';

function App() {
  const queryClient = new QueryClient();

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="details" element={<DetailLayout />}>
              <Route path="site/:id" element={<DetailsPage detailType={"site"}/>}/>
              <Route path="right/:id" element={<DetailsPage detailType={"right"} />} />
            </Route> 
          </Route>
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
