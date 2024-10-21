import React from 'react';
import { createContext, FC, useContext, useState } from "react";

interface HomePageContextState {
  downloadModal: JSX.Element | undefined,
  setDownloadModal: (modal: JSX.Element | undefined) => void,
  showDownloadModal: boolean,
  setShowDownloadModal: (shouldShow: boolean) => void,
  uploadModal: JSX.Element | undefined,
  setUploadModal: (modal: JSX.Element | undefined) => void,
  showUploadModal: boolean,
  setShowUploadModal: (shouldShow: boolean) => void,
}

const defaultState: HomePageContextState = {
  downloadModal: undefined,
  setDownloadModal: () => {},
  showDownloadModal: false,
  setShowDownloadModal: () => {},
  uploadModal: undefined,
  setUploadModal: () => {},
  showUploadModal: false,
  setShowUploadModal: () => {}
}

const HomePageContext = createContext<HomePageContextState>(defaultState);
export const useHomePageContext = () => useContext(HomePageContext)

export const HomePageProvider: FC = ({ children }) => {
  const [ downloadModal, setDownloadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showDownloadModal, setShowDownloadModal ] = useState(false);
  const [ uploadModal, setUploadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showUploadModal, setShowUploadModal ] = useState(false);

  const filterContextProviderValue = {
    downloadModal,
    setDownloadModal,
    showDownloadModal,
    setShowDownloadModal,
    uploadModal,
    setUploadModal,
    showUploadModal,
    setShowUploadModal
  };

  return (
    <HomePageContext.Provider value={filterContextProviderValue}>
      {children}
    </HomePageContext.Provider>
  );
}