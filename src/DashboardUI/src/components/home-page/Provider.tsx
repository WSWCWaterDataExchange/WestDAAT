import { createContext, FC, useState } from "react";

interface HomePageContextState {
  downloadModal: JSX.Element | undefined,
  setDownloadModal: (modal: JSX.Element| undefined) => void,
  showDownloadModal: boolean,
  setShowDownloadModal: (shouldShow: boolean) => void
}

const defaultState: HomePageContextState = {
  downloadModal: undefined,
  setDownloadModal: () => {},
  showDownloadModal: false,
  setShowDownloadModal: () => {}
}

export const HomePageContext = createContext<HomePageContextState>(defaultState);

export const HomePageProvider: FC = ({ children }) => {
  const [ downloadModal, setDownloadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showDownloadModal, setShowDownloadModal ] = useState(false);
  
  const filterContextProviderValue = {
    downloadModal,
    setDownloadModal,
    showDownloadModal,
    setShowDownloadModal
  }

  return (
    <HomePageContext.Provider value={filterContextProviderValue}>
      {children}
    </HomePageContext.Provider>
  );
}