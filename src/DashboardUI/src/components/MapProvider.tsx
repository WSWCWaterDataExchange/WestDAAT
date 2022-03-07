import { CircleLayer, VectorSource } from "mapbox-gl";
import { createContext, FC, useState } from "react";

export enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
}

interface Source {
  id: string,
  source: VectorSource
};

interface Layer extends CircleLayer {
  friendlyName: string
}

export interface MapData {
  sources: Source[];
  layers: Layer[];
}

interface MapContextState {
  baseMap: MapTypes;
  setCurrentBaseMap: (mapType: MapTypes) => void;
  sources: Source[];
  setCurrentSources: (sources: Source[]) => void;
  layers: Layer[];
  setCurrentLayers: (layers: Layer[]) => void;
};

const defaultState: MapContextState = {
  baseMap: MapTypes.WaterRights,
  setCurrentBaseMap: () => { },
  sources: [],
  setCurrentSources: () => { },
  layers: [],
  setCurrentLayers: () => { }
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {

  const [baseMap, setBaseMap] = useState(defaultState.baseMap);
  const setCurrentBaseMap = (mapType: MapTypes) => setBaseMap(mapType);

  const [sources, setSources] = useState<Source[]>([]);
  const setCurrentSources = (sources: Source[]) => setSources(sources);

  const [layers, setLayers] = useState<Layer[]>([]);
  const setCurrentLayers = (layers: Layer[]) => setLayers(layers);

  const mapContextProviderValue = {
    baseMap,
    setCurrentBaseMap,
    sources,
    setCurrentSources,
    layers,
    setCurrentLayers
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
