import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import {
  ApplicationAction,
  ConservationApplicationState as ApplicationState,
  defaultState,
  reducer,
} from './ConservationApplicationState';

interface ConservationApplicationContextProps {
  state: ApplicationState;
  dispatch: React.Dispatch<ApplicationAction>;
}

const ConservationApplicationContext = createContext<ConservationApplicationContextProps | undefined>(undefined);

interface ConservationApplicationProviderProps {
  children: ReactNode;
}

export const ConservationApplicationProvider = (props: ConservationApplicationProviderProps) => {
  // Set initial state
  const [state, dispatch] = useReducer(reducer, defaultState());

  // This will reduce unnecessary re-renders when the state has not changed.
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ConservationApplicationContext.Provider value={value}>{props.children}</ConservationApplicationContext.Provider>
  );
};

// Custom hook to use the ConservationApplicationProvider
export const useConservationApplicationContext = (): ConservationApplicationContextProps => {
  const context = useContext(ConservationApplicationContext);

  if (context === undefined) {
    throw new Error('useConservationApplicationContext must be used within a ConservationApplicationProvider');
  }

  return context;
};
