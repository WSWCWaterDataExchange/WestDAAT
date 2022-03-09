import mapboxgl, { CircleLayer, VectorSource } from "mapbox-gl";
import { createContext, FC, ReactElement, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
  TempNldi = "tempNldi",
}

export enum MapStyle {
  Light = "light-v10",
  Dark = "dark-v10",
  Street = "streets-v11",
  Outdoor = "outdoors-v11",
  Satellite = "satellite-v9"
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
  mapStyle: MapStyle;
}

interface MapContextState {
  map: mapboxgl.Map | null,
  setCurrentMap: (map: mapboxgl.Map) => void,
  mapStyle: MapStyle;
  setCurrentMapStyle: (style: MapStyle) => void;
  sources: Source[];
  setCurrentSources: (sources: Source[]) => void;
  layers: Layer[];
  setCurrentLayers: (layers: Layer[]) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setVisibleMapLayersFilter: (visibleLayerIds: string[]) => void;
  legend: ReactElement | null;
  setLegend: (legend: ReactElement | null) => void;
  mapFilters: MapFilters;
  clearMapFilters: () => void;
};

const defaultState: MapContextState = {
  map: null as mapboxgl.Map | null,
  setCurrentMap: () => { },
  mapStyle: MapStyle.Light,
  setCurrentMapStyle: () => { },
  sources: [],
  setCurrentSources: () => { },
  layers: [],
  setCurrentLayers: () => { },
  setLayerVisibility: () => { },
  setVisibleMapLayersFilter: () => { },
  legend: null as ReactElement | null,
  setLegend: () => { },
  mapFilters: {
    visibleLayerIds: [],
    mapStyle: MapStyle.Light
  },
  clearMapFilters: () => { },
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const setCurrentMap = (map: mapboxgl.Map) => setMap(map);

  const [mapStyle, setMapStyle] = useState(MapStyle.Light);
  const setCurrentMapStyle = (mapStyle: MapStyle) => {
    setMapFilters({
      ...mapFilters,
      mapStyle
    });
    setMapStyle(mapStyle);
  }

  const [mapFilters, setMapFilters] = useState<MapFilters>(defaultState.mapFilters);
  const clearMapFilters = () => {
    setMapFilters(defaultState.mapFilters);
    layers.forEach(layer => setLayerVisibility(layer.id, true));
  };

  let [urlParams, setUrlParams] = useSearchParams();

  const setVisibleMapLayersFilter = (visibleLayerIds: string[]) => {
    setMapFilters({
      ...mapFilters,
      visibleLayerIds
    });
  }

  useEffect(() => {
    updateFilterUrlParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapFilters])

  useEffect(() => {
    // Restore mapFilter state from URL params
    const mapFilters = JSON.parse(urlParams.get("mapFilters") as string) as MapFilters;
    setMapFilters({
      visibleLayerIds: mapFilters?.visibleLayerIds || [],
      mapStyle: mapFilters?.mapStyle || MapStyle.Light
    });
    console.log("Initial map filters from url:", mapFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilterUrlParams = () => {
    let prevParams: any = {}
    urlParams.forEach((value, key) => {
      prevParams[key] = value;
    });

    setUrlParams({
      ...prevParams,
      mapFilters: JSON.stringify(mapFilters)
    });
  };

  const [sources, setSources] = useState<Source[]>([]);
  const setCurrentSources = (sources: Source[]) => setSources(sources);

  const [layers, setLayers] = useState<Layer[]>([]);
  const setCurrentLayers = (layers: Layer[]) => {
    layers.forEach(layer => {
      if (layer.layout) {
        const isVisible = mapFilters.visibleLayerIds.includes(layer.id) || mapFilters.visibleLayerIds.length === 0;
        layer.layout.visibility = isVisible ? "visible" : "none";
      }
    });
    setLayers(layers);
  }

  const [legend, setLegend] = useState<ReactElement | null>(null);

  const setLayerVisibility = (layerId: string, visible: boolean) => {
    if (map) {
      map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    }
  };


  const mapContextProviderValue = {
    map,
    setCurrentMap,
    mapStyle,
    setCurrentMapStyle,
    sources,
    setCurrentSources,
    layers,
    setCurrentLayers,
    setLayerVisibility,
    setVisibleMapLayersFilter,
    legend,
    setLegend,
    mapFilters,
    clearMapFilters
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
