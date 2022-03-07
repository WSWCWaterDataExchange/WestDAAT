import mapboxgl, { CircleLayer, VectorSource } from "mapbox-gl";
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
  map: mapboxgl.Map | null,
  setCurrentMap: (map: mapboxgl.Map) => void,
  baseMap: MapTypes;
  setCurrentBaseMap: (mapType: MapTypes) => void;
  sources: Source[];
  setCurrentSources: (sources: Source[]) => void;
  layers: Layer[];
  setCurrentLayers: (layers: Layer[]) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
};

const defaultState: MapContextState = {
  map: null as mapboxgl.Map | null,
  setCurrentMap: () => { },
  baseMap: MapTypes.WaterRights,
  setCurrentBaseMap: () => { },
  sources: [],
  setCurrentSources: () => { },
  layers: [],
  setCurrentLayers: () => { },
  setLayerVisibility: () => { }
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {

  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const setCurrentMap = (map: mapboxgl.Map) => setMap(map);

  const [baseMap, setBaseMap] = useState(defaultState.baseMap);
  const setCurrentBaseMap = (mapType: MapTypes) => setBaseMap(mapType);

  const [sources, setSources] = useState<Source[]>([]);
  const setCurrentSources = (sources: Source[]) => setSources(sources);

  const [layers, setLayers] = useState<Layer[]>([]);
  const setCurrentLayers = (layers: Layer[]) => setLayers(layers);

  const setLayerVisibility = (layerId: string, visible: boolean) => {
    if (map) {
      map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    }
  };

  const mapContextProviderValue = {
    map,
    setCurrentMap,
    baseMap,
    setCurrentBaseMap,
    sources,
    setCurrentSources,
    layers,
    setCurrentLayers,
    setLayerVisibility
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;