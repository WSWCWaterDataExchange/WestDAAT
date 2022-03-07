import mapboxgl, { CircleLayer, VectorSource } from "mapbox-gl";
import { createContext, FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
}

interface Source {
  id: string,
  source: VectorSource
};

export interface Layer extends CircleLayer {
  friendlyName: string
}

export interface MapData {
  sources: Source[];
  layers: Layer[];
}

export interface MapFilters {
  visibleLayerIds: string[];
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
  setVisibleMapLayersFilter: (visibleLayerIds: string[]) => void;
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
  setLayerVisibility: () => { },
  setVisibleMapLayersFilter: () => { },
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {

  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const setCurrentMap = (map: mapboxgl.Map) => setMap(map);

  const [mapFilters, setMapFilters] = useState<MapFilters>();

  let [urlParams, setUrlParams] = useSearchParams();

  const setVisibleMapLayersFilter = (visibleLayerIds: string[]) => {
    setMapFilters({
      ...mapFilters,
      visibleLayerIds
    });
  }

  useEffect(() => {
    updateFilterUrlParams();
  }, [mapFilters])

  const updateFilterUrlParams = () => {
    setUrlParams({
      ...urlParams,
      mapFilters: JSON.stringify(mapFilters)
    });
  };

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
    setLayerVisibility,
    setVisibleMapLayersFilter
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
