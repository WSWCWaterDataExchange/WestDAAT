import { createContext, FC, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../AppProvider";
import deepEqual from 'fast-deep-equal/es6';
import { useLinkClickHandler } from "react-router-dom";

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
export type MapLayerCircleColorsType = { [layer: string]: any };
type setFiltersParamType = { layer: string, filter: MapLayerFilterType } | { layer: string, filter: MapLayerFilterType }[]
type setCircleColorsParamType = { layer: string, circleColor: any } | { layer: string, circleColor: any }[]

type RenderedFeatureType = GeoJSON.Feature<GeoJSON.Geometry> & { layer: { id: string }, source: string }

interface MapContextState {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  legend: ReactElement | null;
  setLegend: React.Dispatch<React.SetStateAction<ReactElement | null>>;
  filters: MapLayerFiltersType;
  setLayerFilters: (filters: setFiltersParamType) => void;
  circleColors: MapLayerCircleColorsType;
  setLayerCircleColors: (circleColors: setCircleColorsParamType) => void;
  geoJsonData: { source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String }[]
  setGeoJsonData: (source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String) => void;
  visibleLayers: string[],
  setVisibleLayers: (layers: string[]) => void,
  renderedFeatures: RenderedFeatureType[],
  setRenderedFeatures: React.Dispatch<React.SetStateAction<RenderedFeatureType[]>>
};

const defaultState: MapContextState = {
  mapStyle: MapStyle.Light,
  setMapStyle: () => { },
  legend: null as ReactElement | null,
  setLegend: () => { },
  filters: {},
  setLayerFilters: () => { },
  circleColors: {},
  setLayerCircleColors: () => { },
  geoJsonData: [],
  setGeoJsonData: () => { },
  visibleLayers: [],
  setVisibleLayers: () => { },
  renderedFeatures: [],
  setRenderedFeatures: () => { }
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {
  const { getUrlParam, setUrlParam } = useContext(AppContext)

  const [mapStyle, setMapStyle] = useState(getUrlParam<MapStyle>("ms") ?? MapStyle.Light);
  const setMapStyleInternal = (mapStyle: MapStyle): void => {
    setMapStyle(mapStyle);
  }
  useEffect(() => {
    if (mapStyle === MapStyle.Light) {
      setUrlParam("ms", undefined);
    } else {
      setUrlParam("ms", mapStyle);
    }
  }, [mapStyle, setUrlParam])

  const [filters, setFilters] = useState<MapLayerFiltersType>({});
  const setLayerFilters = useCallback((updatedFilters: setFiltersParamType): void => {
    setFilters(s => {
      const filterArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
      const updatedFilterSet = { ...s };
      filterArray.forEach(value => {
        updatedFilterSet[value.layer] = value.filter
      })
      if (!deepEqual(s, updatedFilterSet)) {
        return updatedFilterSet;
      }
      return s;
    })
  }, [setFilters]);

  const [circleColors, setCircleColors] = useState<MapLayerCircleColorsType>({});
  const setLayerCircleColors = useCallback((updatedFilters: setCircleColorsParamType): void => {
    setCircleColors(s => {
      const circleColorArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
      const updatedCircleColorSet = { ...s };
      circleColorArray.forEach(value => {
        updatedCircleColorSet[value.layer] = value.circleColor
      })
      if (!deepEqual(s, updatedCircleColorSet)) {
        return updatedCircleColorSet;
      }
      return s;
    })
  }, [setCircleColors]);

  const [geoJsonData, setAllGeoJsonData] = useState<{ source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String }[]>([]);
  const setGeoJsonData = useCallback((source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String) => {
    setAllGeoJsonData(s => {
      const unchangedData = s.filter(a => a.source !== source);
      const updatedData = [...unchangedData, { source, data }];

      if (!deepEqual(s, updatedData)) {
        return updatedData;
      }
      return s;
    });
  }, [setAllGeoJsonData])

  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const [legend, setLegend] = useState<ReactElement | null>(null);

  const [renderedFeatures, setRenderedFeatures] = useState<RenderedFeatureType[]>([]);

  const mapContextProviderValue = {
    mapStyle,
    setMapStyle: setMapStyleInternal,
    legend,
    setLegend,
    filters,
    setLayerFilters,
    circleColors,
    setLayerCircleColors,
    geoJsonData,
    setGeoJsonData,
    visibleLayers,
    setVisibleLayers,
    renderedFeatures,
    setRenderedFeatures
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
