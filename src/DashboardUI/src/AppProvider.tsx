import { createContext, FC, useState } from "react";

export interface User {
  username: string;
}

interface AppContextState {
  user: User | null,
  setCurrentUser: (username: string) => void,
};

const defaultAppContextState: AppContextState = {
  // User will get set on user login
  user: null,
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
