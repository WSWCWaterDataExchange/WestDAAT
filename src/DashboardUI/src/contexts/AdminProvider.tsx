import { createContext, ReactNode, useMemo, useReducer } from 'react';

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
