import React, { createContext, FC, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../AppProvider";
import deepEqual from 'fast-deep-equal/es6';
import { MapBoundSettings } from '../data-contracts/MapBoundSettings';
import { Directions, DataPoints } from "../data-contracts/nldi";

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

export interface MapSettings {
  zoomLevel: number,
  latitude: number,
  longitude: number,
}

export const defaultMapLocationData: MapSettings = ({
  latitude: -100,
  longitude: 40,
  zoomLevel: 4,
})

export type MapLayerFilterType = any[] | boolean | null | undefined;
export type MapLayerFiltersType = { [layer: string]: MapLayerFilterType };
export type MapLayerCircleColorsType = { [layer: string]: any };
export type MapLayerCircleRadiusType = { [layer: string]: any };
export type MapLayerCircleSortKeyType = { [layer: string]: any };
export type MapLayerFillColorsType = { [layer: string]: any };
export type MapClickType = { latitude: number, longitude: number, layer: string, features: GeoJSON.Feature[] };
export type MapPopupType = { latitude: number, longitude: number, element: ReactElement };
type setFiltersParamType = { layer: string, filter: MapLayerFilterType } | { layer: string, filter: MapLayerFilterType }[]
type setCircleColorsParamType = { layer: string, circleColor: any } | { layer: string, circleColor: any }[]
type setCircleRadiusParamType = { layer: string, circleRadius: any } | { layer: string, circleRadius: any }[]
type setCircleSortKeyParamType = { layer: string, circleSortKey: any } | { layer: string, circleSortKey: any }[]
type setFillColorsParamType = { layer: string, fillColor: any } | { layer: string, fillColor: any }[]
export type RenderedFeatureType = GeoJSON.Feature<GeoJSON.Geometry> & { layer: { id: string }, source: string }

export enum MapAlertPriority {
  Critical = 0,
  Error = 1,
  Warning = 2,
  Information = 3
}

interface MapContextState {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  legend: JSX.Element | null;
  setLegend: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
  filters: MapLayerFiltersType;
  setLayerFilters: (filters: setFiltersParamType) => void;
  circleColors: MapLayerCircleColorsType;
  setLayerCircleColors: (circleColors: setCircleColorsParamType) => void;
  circleRadii: MapLayerCircleRadiusType;
  setLayerCircleRadii: (circleColors: setCircleRadiusParamType) => void;
  circleSortKeys: MapLayerCircleSortKeyType;
  setLayerCircleSortKeys: (circleColors: setCircleSortKeyParamType) => void;
  fillColors: MapLayerFillColorsType;
  setLayerFillColors: (fillColors: setFillColorsParamType) => void;
  geoJsonData: { source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String }[]
  setGeoJsonData: (source: string, data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String) => void;
  vectorUrls: { source: string, url: string }[]
  setVectorUrl: (source: string, url: string) => void;
  visibleLayers: string[],
  setVisibleLayers: (layers: string[]) => void,
  renderedFeatures: RenderedFeatureType[],
  setRenderedFeatures: React.Dispatch<React.SetStateAction<RenderedFeatureType[]>>,
  mapAlert: JSX.Element | null,
  changeAlertDisplay: (key: string, display: boolean, element: JSX.Element, priority: MapAlertPriority) => void,
  removeAlertDisplay: (key: string) => void,
  mapBoundSettings: MapBoundSettings | null,
  setMapBoundSettings: (settings: MapBoundSettings) => void,
  mapClickedFeatures: MapClickType | null,
  setMapClickedFeatures: React.Dispatch<React.SetStateAction<MapClickType | null>>,
  mapPopup: MapPopupType | null,
  setMapPopup: React.Dispatch<React.SetStateAction<MapPopupType | null>>,
  polylines: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[],
  setPolylines: (identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> | null) => void,
  nldiFilterData: { latitude: number | null, longitude: number | null, directions: Directions, dataPoints: DataPoints } | null,
  setNldiFilterData: React.Dispatch<React.SetStateAction<{ latitude: number | null, longitude: number | null, directions: Directions, dataPoints: DataPoints } | null>>,
  mapLocationSettings: { latitude: number, longitude: number, zoomLevel: number } | null,
  setMapLocationSettings: React.Dispatch<React.SetStateAction<{ latitude: number, longitude: number, zoomLevel: number }>>
};

const defaultState: MapContextState = {
  mapStyle: MapStyle.Light,
  setMapStyle: () => { },
  legend: null,
  setLegend: () => { },
  filters: {},
  setLayerFilters: () => { },
  circleColors: {},
  setLayerCircleColors: () => { },
  circleRadii: {},
  setLayerCircleRadii: () => { },
  circleSortKeys: {},
  setLayerCircleSortKeys: () => { },
  fillColors: {},
  setLayerFillColors: () => { },
  geoJsonData: [],
  setGeoJsonData: () => { },
  vectorUrls: [],
  setVectorUrl: () => { },
  visibleLayers: [],
  setVisibleLayers: () => { },
  renderedFeatures: [],
  setRenderedFeatures: () => { },
  mapAlert: null,
  changeAlertDisplay: () => { },
  removeAlertDisplay: () => { },
  mapBoundSettings: null,
  setMapBoundSettings: () => { },
  mapClickedFeatures: null,
  setMapClickedFeatures: () => { },
  mapPopup: null,
  setMapPopup: () => { },
  polylines: [],
  setPolylines: () => { },
  nldiFilterData: null,
  setNldiFilterData: () => { },
  mapLocationSettings: null,
  setMapLocationSettings: () => { },
};

export const MapContext = createContext<MapContextState>(defaultState);

const MapProvider: FC = ({ children }) => {

  const { getUrlParam, setUrlParam } = useContext(AppContext)

  const [mapStyle, setMapStyle] = useState(getUrlParam<MapStyle>("ms") ?? MapStyle.Light);
  const setMapStyleInternal = (mapStyle: MapStyle): void => {
    setMapStyle(mapStyle);
  }

  const [mapLocationSettings, setMapLocationSettings] = useState(getUrlParam<MapSettings>("map") ?? defaultMapLocationData);

  useEffect(() => {
    if (mapLocationSettings === defaultMapLocationData) {
      setUrlParam("map", undefined);
    } else {
      setUrlParam("map", mapLocationSettings);
    }
  }, [mapLocationSettings, setUrlParam])

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

  const [circleRadii, setCircleRadii] = useState<MapLayerCircleRadiusType>({});
  const setLayerCircleRadii = useCallback((updatedFilters: setCircleRadiusParamType): void => {
    setCircleRadii(s => {
      const circleRadiusArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
      const updatedCircleRadiusSet = { ...s };
      circleRadiusArray.forEach(value => {
        updatedCircleRadiusSet[value.layer] = value.circleRadius
      })
      if (!deepEqual(s, updatedCircleRadiusSet)) {
        return updatedCircleRadiusSet;
      }
      return s;
    })
  }, [setCircleRadii]);

  const [circleSortKeys, setCircleSortKeys] = useState<MapLayerCircleSortKeyType>({});
  const setLayerCircleSortKeys = useCallback((updatedFilters: setCircleSortKeyParamType): void => {
    setCircleSortKeys(s => {
      const circleSortKeyArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
      const updatedCircleSortKeySet = { ...s };
      circleSortKeyArray.forEach(value => {
        updatedCircleSortKeySet[value.layer] = value.circleSortKey
      })
      if (!deepEqual(s, updatedCircleSortKeySet)) {
        return updatedCircleSortKeySet;
      }
      return s;
    })
  }, [setCircleSortKeys]);

  const [fillColors, setFillColors] = useState<MapLayerFillColorsType>({});
  const setLayerFillColors = useCallback((updatedFilters: setFillColorsParamType): void => {
    setFillColors(s => {
      const fillColorArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
      const updatedFillColorSet = { ...s };
      fillColorArray.forEach(value => {
        updatedFillColorSet[value.layer] = value.fillColor
      })
      if (!deepEqual(s, updatedFillColorSet)) {
        return updatedFillColorSet;
      }
      return s;
    })
  }, [setFillColors]);

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

  const [vectorUrls, setAllVectorUrls] = useState<{ source: string, url: string }[]>([]);
  const setVectorUrl = useCallback((source: string, url: string) => {
    setAllVectorUrls(s => {
      const unchangedData = s.filter(a => a.source !== source);
      const updatedData = [...unchangedData, { source, url }];

      if (!deepEqual(s, updatedData)) {
        return updatedData;
      }
      return s;
    });
  }, [setAllVectorUrls])

  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const [legend, setLegend] = useState<JSX.Element | null>(null);

  const [renderedFeatures, setRenderedFeatures] = useState<RenderedFeatureType[]>([]);

  const [mapAlerts, setMapAlerts] = useState<{ key: string, display: boolean, element: JSX.Element, priority: MapAlertPriority }[]>([]);
  const mapAlert = useMemo(() => {
    return [...mapAlerts].sort((a, b) => a.priority as number - b.priority as number).find(a => a.display)?.element ?? null;
  }, [mapAlerts]);
  const changeAlertDisplay = useCallback((key: string, display: boolean, element: JSX.Element, priority: MapAlertPriority) => {
    setMapAlerts(s => {
      const unchangedData = s.filter(a => a.key !== key);
      return [...unchangedData, {
        key,
        display,
        element,
        priority
      }]
    })
  }, [setMapAlerts])
  const removeAlertDisplay = useCallback((key: string) => {
    setMapAlerts(s => {
      return s.filter(a => a.key !== key);
    })
  }, [setMapAlerts])

  const [mapBoundSettings, setMapBoundSettings] = useState<MapBoundSettings | null>(null);

  const [mapClickedFeatures, setMapClickedFeatures] = useState<MapClickType | null>(null);

  const [mapPopup, setMapPopup] = useState<MapPopupType | null>(null);

  const [polylines, setAllPolylines] = useState<{ identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[]>([]);
  const setPolylines = useCallback((identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> | null) => {
    setAllPolylines(s => {
      const unchangedData = s.filter(a => identifier !== null && a.identifier !== identifier && a.data !== null);
      if (data !== null && identifier !== null) {
        const updatedData = [...unchangedData, { identifier, data }];
        if (!deepEqual(s, updatedData)) {
          return updatedData;
        } else {
          return s;
        }
      }
      return unchangedData;
    });
  }, [setAllPolylines])

  const [nldiFilterData, setNldiFilterData] = useState<{ latitude: number | null, longitude: number | null, directions: Directions, dataPoints: DataPoints } | null>(null);

  const mapContextProviderValue = {
    mapStyle,
    setMapStyle: setMapStyleInternal,
    legend,
    setLegend,
    filters,
    setLayerFilters,
    circleColors,
    setLayerCircleColors,
    circleRadii,
    setLayerCircleRadii,
    circleSortKeys,
    setLayerCircleSortKeys,
    fillColors,
    setLayerFillColors,
    geoJsonData,
    setGeoJsonData,
    vectorUrls,
    setVectorUrl,
    visibleLayers,
    setVisibleLayers,
    renderedFeatures,
    setRenderedFeatures,
    mapBoundSettings,
    setMapBoundSettings,
    mapAlert,
    changeAlertDisplay,
    removeAlertDisplay,
    mapClickedFeatures,
    setMapClickedFeatures,
    mapPopup,
    setMapPopup,
    polylines,
    setPolylines,
    nldiFilterData,
    setNldiFilterData,
    mapLocationSettings,
    setMapLocationSettings,
  };

  return (
    <MapContext.Provider value={mapContextProviderValue}>
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
