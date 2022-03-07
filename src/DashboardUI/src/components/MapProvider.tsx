import { createContext, FC, useState } from "react";

export enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
}

interface MapContextState {
  baseMap: MapTypes;
  setCurrentBaseMap: (mapType: MapTypes) => void;
};

const defaultState: MapContextState = {
  baseMap: MapTypes.WaterRights,
  setCurrentBaseMap: () => { }
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {

  const [baseMap, setBaseMap] = useState(defaultState.baseMap);
  const setCurrentBaseMap = (mapType: MapTypes) => setBaseMap(mapType);

  const mapContextProviderValue = {
    baseMap,
    setCurrentBaseMap
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
