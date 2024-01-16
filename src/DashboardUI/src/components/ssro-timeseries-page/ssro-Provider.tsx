import { createContext, FC, useContext, useState } from "react";

interface SiteSpecificPageContextState {
  downloadModal: JSX.Element | undefined,
  setDownloadModal: (modal: JSX.Element| undefined) => void,
  showDownloadModal: boolean,
  setShowDownloadModal: (shouldShow: boolean) => void
}

const defaultState: SiteSpecificPageContextState = {
  downloadModal: undefined,
  setDownloadModal: () => {},
  showDownloadModal: false,
  setShowDownloadModal: () => {}
}

const SiteSpecificPageContext = createContext<SiteSpecificPageContextState>(defaultState);
export const useSiteSpecificPageContext = () => useContext(SiteSpecificPageContext)

export const SiteSpecificPageProvider: FC = ({ children }) => {
  const [ downloadModal, setDownloadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showDownloadModal, setShowDownloadModal ] = useState(false);
  
  const filterContextProviderValue = {
    downloadModal,
    setDownloadModal,
    showDownloadModal,
    setShowDownloadModal
  }

  return (
    <SiteSpecificPageContext.Provider value={filterContextProviderValue}>
      {children}
    </SiteSpecificPageContext.Provider>
  );
}