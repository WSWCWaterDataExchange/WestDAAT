import { createContext, FC, ReactElement, useCallback, useContext, useState } from "react";
import { AppContext } from "../AppProvider";
import deepEqual from 'fast-deep-equal/es6';

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

export type MapLayerFilterType = any[] | boolean | null | undefined;
export type MapLayerFiltersType = { [layer: string]: MapLayerFilterType };
type setFiltersParamType = { layer: string, filter: MapLayerFilterType } | { layer: string, filter: MapLayerFilterType }[]

interface MapContextState {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  legend: ReactElement | null;
  setLegend: (legend: ReactElement | null) => void;
  filters: MapLayerFiltersType;
  setLayerFilters: (filters: setFiltersParamType) => void;
  geoJsonData: { source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String }[]
  setGeoJsonData: (source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String) => void;
  visibleLayers: string[],
  setVisibleLayers: (layers: string[]) => void,
};

const defaultState: MapContextState = {
  mapStyle: MapStyle.Light,
  setMapStyle: () => { },
  legend: null as ReactElement | null,
  setLegend: () => { },
  filters: {},
  setLayerFilters: () => { },
  geoJsonData: [],
  setGeoJsonData: () => { },
  visibleLayers: [],
  setVisibleLayers: () => { },
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {
  const { getUrlParam, setUrlParam } = useContext(AppContext)

  const [mapStyle, setMapStyle] = useState(getUrlParam<MapStyle>("ms") ?? MapStyle.Light);
  const setMapStyleInternal = (mapStyle: MapStyle): void => {
    setUrlParam("ms", mapStyle);
    setMapStyle(mapStyle);
  }
  const [filters, setFilters] = useState<MapLayerFiltersType>({});

  const setLayerFilters = useCallback((updatedFilters: setFiltersParamType): void => {
    const filterArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
    const updatedFilterSet = { ...filters };
    filterArray.forEach(value => {
      updatedFilterSet[value.layer] = value.filter
    })
    if (!deepEqual(filters, updatedFilterSet)) {
      setFilters(updatedFilterSet)
    }

  }, [setFilters, filters]);
  const [geoJsonData, setAllGeoJsonData] = useState<{ source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String }[]>([]);
  const setGeoJsonData = (source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String) => {
    const unchangedData = geoJsonData.filter(a => a.source !== source);
    setAllGeoJsonData([...unchangedData, { source, data }]);
  }

  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const [legend, setLegend] = useState<ReactElement | null>(null);

  const mapContextProviderValue = {
    mapStyle,
    setMapStyle: setMapStyleInternal,
    legend,
    setLegend,
    filters,
    setLayerFilters,
    geoJsonData,
    setGeoJsonData,
    visibleLayers,
    setVisibleLayers,
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
