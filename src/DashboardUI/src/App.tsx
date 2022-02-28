import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import SideDetailsPage from "./pages/SiteDetailsPage";

import './App.scss';
import { createContext, useState } from "react";

interface AppContextState {
  user?: { username: string },
  setCurrentUser: (username: string) => void,
};

const defaultAppContextState: AppContextState = {
  // User will get set on user login
  user: undefined,
  setCurrentUser: () => {}
};

export const AppContext = createContext<AppContextState>(defaultAppContextState);

function App() {
  const queryClient = new QueryClient();

  const [user, setUser] = useState(defaultAppContextState.user);
  const setCurrentUser = (username: string) => setUser({username});

  const appContextProviderValue = {
    user,
    setCurrentUser
  };

  return (
    <AppContext.Provider value={appContextProviderValue}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="site-details" element={<SideDetailsPage />} />
          </Route>
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

export default App;
