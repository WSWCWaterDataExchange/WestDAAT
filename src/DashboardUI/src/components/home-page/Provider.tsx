import React from 'react';
import { createContext, FC, useContext, useState } from 'react';
import * as geojson from 'geojson';

interface HomePageContextState {
  downloadModal: JSX.Element | undefined,
  setDownloadModal: (modal: JSX.Element | undefined) => void,
  showDownloadModal: boolean,
  setShowDownloadModal: (shouldShow: boolean) => void,
  uploadModal: JSX.Element | undefined,
  setUploadModal: (modal: JSX.Element | undefined) => void,
  showUploadModal: boolean,
  setShowUploadModal: (shouldShow: boolean) => void,
  uploadedGeoJSON: geojson.FeatureCollection | null;
  setUploadedGeoJSON: (data: geojson.FeatureCollection | null) => void;
}


const defaultState: HomePageContextState = {
  downloadModal: undefined,
  setDownloadModal: () => {},
  showDownloadModal: false,
  setShowDownloadModal: () => {},
  uploadModal: undefined,
  setUploadModal: () => {},
  showUploadModal: false,
  setShowUploadModal: () => {},
  uploadedGeoJSON: null,
  setUploadedGeoJSON: () => {}
}

const HomePageContext = createContext<HomePageContextState>(defaultState);
export const useHomePageContext = () => useContext(HomePageContext);

interface HomePageProviderProps {
  children: React.ReactNode;
}
export const HomePageProvider = ({ children }: HomePageProviderProps) => {
  const [ downloadModal, setDownloadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showDownloadModal, setShowDownloadModal ] = useState(false);
  const [ uploadModal, setUploadModal ] = useState<JSX.Element | undefined>(undefined);
  const [ showUploadModal, setShowUploadModal ] = useState(false);
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState<geojson.FeatureCollection | null>(null);

  const filterContextProviderValue = {
    downloadModal,
    setDownloadModal,
    showDownloadModal,
    setShowDownloadModal,
    uploadModal,
    setUploadModal,
    showUploadModal,
    setShowUploadModal,
    uploadedGeoJSON,
    setUploadedGeoJSON
  };

  return (
    <HomePageContext.Provider value={filterContextProviderValue}>
      {children}
    </HomePageContext.Provider>
  );
};
