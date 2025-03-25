import { createContext, useContext } from 'react';

interface ApplicationReviewPageContextState {}

const defaultState: ApplicationReviewPageContextState = {};

const ApplicationReviewPageContext = createContext<ApplicationReviewPageContextState>(defaultState);
export const useApplicationReviewPageContext = () => useContext(ApplicationReviewPageContext);

interface ApplicationReviewPageProviderProps {
  children: React.ReactNode;
}
export const ApplicationReviewPageProvider = ({ children }: ApplicationReviewPageProviderProps) => {
  const state: ApplicationReviewPageContextState = {};

  return <ApplicationReviewPageContext.Provider value={state}>{children}</ApplicationReviewPageContext.Provider>;
};
