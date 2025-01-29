import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import { AdminAction, AdminState, defaultState, reducer } from './AdminState';

interface AdminContextProps {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = (props: AdminProviderProps) => {
  // Set initial state
  const [state, dispatch] = useReducer(reducer, defaultState());

  // This will reduce unnecessary re-renders when the state has not changed.
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

// Custom hook to use the AdminProvider
export const useAdminContext = (): AdminContextProps => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error('useAdminContext must be used within a AdminProvider');
  }

  return context;
};
