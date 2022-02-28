import './App.scss';
import { createContext, FC, useState } from "react";

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

const AppProvider: FC = ({ children }) => {

  const [user, setUser] = useState(defaultAppContextState.user);
  const setCurrentUser = (username: string) => setUser({username});

  const appContextProviderValue = {
    user,
    setCurrentUser
  };

  return (
    <AppContext.Provider value={appContextProviderValue}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
