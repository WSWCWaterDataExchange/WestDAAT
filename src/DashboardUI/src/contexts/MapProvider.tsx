import React, { createContext, JSX, ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import deepEqual from 'fast-deep-equal/es6';
import { MapBoundSettings } from '@data-contracts';

export enum MapTypes {
  WaterRights = 'waterRights',
  Aggregate = 'aggregate',
  TempNldi = 'tempNldi',
}

export enum MapStyle {
  Light = 'light-v10',
  Dark = 'dark-v10',
  Street = 'streets-v11',
  Outdoor = 'outdoors-v11',
  Satellite = 'satellite-v9',
}

export interface MapSettings {
  zoomLevel: number;
  latitude: number;
  longitude: number;
}

export const defaultMapLocationData: MapSettings = {
  latitude: 40,
  longitude: -100,
  zoomLevel: 4,
};

export const defaultMapStyle = MapStyle.Light;

export type MapLayerFilterType = any[] | boolean | null | undefined;
export type MapLayerFiltersType = { [layer: string]: MapLayerFilterType };
export type MapLayerCircleColorsType = { [layer: string]: any };
export type MapLayerCircleRadiusType = { [layer: string]: any };
export type MapLayerCircleSortKeyType = { [layer: string]: any };
export type MapLayerFillColorsType = { [layer: string]: any };
export type MapLayerIconImagesType = { [layer: string]: any };
export type MapClickType = {
  latitude: number;
  longitude: number;
  layer: string;
  features: GeoJSON.Feature[];
};
export type MapPopupType = {
  latitude: number;
  longitude: number;
  element: ReactElement;
};
type setFiltersParamType =
  | { layer: string; filter: MapLayerFilterType }
  | { layer: string; filter: MapLayerFilterType }[];
type setCircleColorsParamType = { layer: string; circleColor: any } | { layer: string; circleColor: any }[];
type setCircleRadiusParamType = { layer: string; circleRadius: any } | { layer: string; circleRadius: any }[];
type setCircleSortKeyParamType = { layer: string; circleSortKey: any } | { layer: string; circleSortKey: any }[];
type setFillColorsParamType = { layer: string; fillColor: any } | { layer: string; fillColor: any }[];
type setIconImagesParamType = { layer: string; iconImages: any } | { layer: string; iconImages: any }[];
export type RenderedFeatureType = GeoJSON.Feature<GeoJSON.Geometry> & {
  layer: { id: string };
  source: string;
};

export enum MapAlertPriority {
  Critical = 0,
  Error = 1,
  Warning = 2,
  Information = 3,
}

interface MapContextState {
  isMapLoaded: boolean;
  setIsMapLoaded: (isLoaded: boolean) => void;
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
  iconImages: MapLayerIconImagesType;
  setLayerIconImages: (iconImages: setIconImagesParamType) => void;
  geoJsonData: {
    source: string;
    data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string;
  }[];
  setGeoJsonData: (
    source: string,
    data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string,
  ) => void;
  userDrawnPolygonData: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[];
  setUserDrawnPolygonData: (polygons: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]) => void;
  vectorUrls: { source: string; url: string }[];
  setVectorUrl: (source: string, url: string) => void;
  visibleLayers: string[];
  setVisibleLayers: (layers: string[]) => void;
  renderedFeatures: RenderedFeatureType[];
  setRenderedFeatures: React.Dispatch<React.SetStateAction<RenderedFeatureType[]>>;
  mapAlert: JSX.Element | null;
  changeAlertDisplay: (key: string, display: boolean, element: JSX.Element, priority: MapAlertPriority) => void;
  removeAlertDisplay: (key: string) => void;
  mapBoundSettings: MapBoundSettings | null;
  setMapBoundSettings: (settings: MapBoundSettings) => void;
  mapClickedFeatures: MapClickType | null;
  setMapClickedFeatures: React.Dispatch<React.SetStateAction<MapClickType | null>>;
  mapPopup: MapPopupType | null;
  setMapPopup: React.Dispatch<React.SetStateAction<MapPopupType | null>>;
  polylines: GeoJSON.Feature<GeoJSON.Geometry>[];
  setPolylines: (data: GeoJSON.Feature<GeoJSON.Geometry>[]) => void;
  mapLocationSettings: {
    latitude: number;
    longitude: number;
    zoomLevel: number;
  } | null;
  setMapLocationSettings: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
      zoomLevel: number;
    }>
  >;
  isMapRendering: boolean;
  setIsMapRendering: React.Dispatch<React.SetStateAction<boolean>>;
  drawPolygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  setDrawPolygon: React.Dispatch<React.SetStateAction<GeoJSON.Feature<GeoJSON.Polygon> | null>>;
}

const defaultState: MapContextState = {
  isMapLoaded: false,
  setIsMapLoaded: () => {},
  mapStyle: MapStyle.Light,
  setMapStyle: () => {},
  legend: null,
  setLegend: () => {},
  filters: {},
  setLayerFilters: () => {},
  circleColors: {},
  setLayerCircleColors: () => {},
  circleRadii: {},
  setLayerCircleRadii: () => {},
  circleSortKeys: {},
  setLayerCircleSortKeys: () => {},
  fillColors: {},
  setLayerFillColors: () => {},
  iconImages: {},
  setLayerIconImages: () => {},
  geoJsonData: [],
  setGeoJsonData: () => {},
  userDrawnPolygonData: [],
  setUserDrawnPolygonData: () => {},
  vectorUrls: [],
  setVectorUrl: () => {},
  visibleLayers: [],
  setVisibleLayers: () => {},
  renderedFeatures: [],
  setRenderedFeatures: () => {},
  mapAlert: null,
  changeAlertDisplay: () => {},
  removeAlertDisplay: () => {},
  mapBoundSettings: null,
  setMapBoundSettings: () => {},
  mapClickedFeatures: null,
  setMapClickedFeatures: () => {},
  mapPopup: null,
  setMapPopup: () => {},
  polylines: [],
  setPolylines: () => {},
  mapLocationSettings: defaultMapLocationData,
  setMapLocationSettings: () => {},
  isMapRendering: false,
  setIsMapRendering: () => {},
  drawPolygon: null,
  setDrawPolygon: () => {},
};

const MapContext = createContext<MapContextState>(defaultState);
export const useMapContext = () => useContext(MapContext);

interface MapProviderProps {
  children: React.ReactNode;
}
const MapProvider = ({ children }: MapProviderProps) => {
  const [drawPolygon, setDrawPolygon] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState(defaultMapStyle);

  const [mapLocationSettings, setMapLocationSettings] = useState(defaultMapLocationData);

  const [filters, setFilters] = useState<MapLayerFiltersType>({});
  const setLayerFilters = useCallback(
    (updatedFilters: setFiltersParamType): void => {
      setFilters((s) => {
        const filterArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedFilterSet = { ...s };
        filterArray.forEach((value) => {
          updatedFilterSet[value.layer] = value.filter;
        });
        if (!deepEqual(s, updatedFilterSet)) {
          return updatedFilterSet;
        }
        return s;
      });
    },
    [setFilters],
  );

  const [circleColors, setCircleColors] = useState<MapLayerCircleColorsType>({});
  const setLayerCircleColors = useCallback(
    (updatedFilters: setCircleColorsParamType): void => {
      setCircleColors((s) => {
        const circleColorArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedCircleColorSet = { ...s };
        circleColorArray.forEach((value) => {
          updatedCircleColorSet[value.layer] = value.circleColor;
        });
        if (!deepEqual(s, updatedCircleColorSet)) {
          return updatedCircleColorSet;
        }
        return s;
      });
    },
    [setCircleColors],
  );

  const [circleRadii, setCircleRadii] = useState<MapLayerCircleRadiusType>({});
  const setLayerCircleRadii = useCallback(
    (updatedFilters: setCircleRadiusParamType): void => {
      setCircleRadii((s) => {
        const circleRadiusArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedCircleRadiusSet = { ...s };
        circleRadiusArray.forEach((value) => {
          updatedCircleRadiusSet[value.layer] = value.circleRadius;
        });
        if (!deepEqual(s, updatedCircleRadiusSet)) {
          return updatedCircleRadiusSet;
        }
        return s;
      });
    },
    [setCircleRadii],
  );

  const [circleSortKeys, setCircleSortKeys] = useState<MapLayerCircleSortKeyType>({});
  const setLayerCircleSortKeys = useCallback(
    (updatedFilters: setCircleSortKeyParamType): void => {
      setCircleSortKeys((s) => {
        const circleSortKeyArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedCircleSortKeySet = { ...s };
        circleSortKeyArray.forEach((value) => {
          updatedCircleSortKeySet[value.layer] = value.circleSortKey;
        });
        if (!deepEqual(s, updatedCircleSortKeySet)) {
          return updatedCircleSortKeySet;
        }
        return s;
      });
    },
    [setCircleSortKeys],
  );

  const [fillColors, setFillColors] = useState<MapLayerFillColorsType>({});
  const setLayerFillColors = useCallback(
    (updatedFilters: setFillColorsParamType): void => {
      setFillColors((s) => {
        const fillColorArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedFillColorSet = { ...s };
        fillColorArray.forEach((value) => {
          updatedFillColorSet[value.layer] = value.fillColor;
        });
        if (!deepEqual(s, updatedFillColorSet)) {
          return updatedFillColorSet;
        }
        return s;
      });
    },
    [setFillColors],
  );

  const [iconImages, setIconImages] = useState<MapLayerIconImagesType>({});
  const setLayerIconImages = useCallback(
    (updatedFilters: setIconImagesParamType): void => {
      setIconImages((s) => {
        const iconImageArray = Array.isArray(updatedFilters) ? updatedFilters : [updatedFilters];
        const updatedIconImageSet = { ...s };
        iconImageArray.forEach((value) => {
          updatedIconImageSet[value.layer] = value.iconImages;
        });
        if (!deepEqual(s, updatedIconImageSet)) {
          return updatedIconImageSet;
        }
        return s;
      });
    },
    [setIconImages],
  );

  const [geoJsonData, setAllGeoJsonData] = useState<
    {
      source: string;
      data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string;
    }[]
  >([]);
  const setGeoJsonData = useCallback(
    (
      source: string,
      data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string,
    ) => {
      setAllGeoJsonData((s) => {
        const unchangedData = s.filter((a) => a.source !== source);
        const updatedData = [...unchangedData, { source, data }];

        if (!deepEqual(s, updatedData)) {
          return updatedData;
        }
        return s;
      });
    },
    [setAllGeoJsonData],
  );

  const [userDrawnPolygonData, setUserDrawnPolygonData] = useState<
    GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]
  >([]);

  const [vectorUrls, setAllVectorUrls] = useState<{ source: string; url: string }[]>([]);
  const setVectorUrl = useCallback(
    (source: string, url: string) => {
      setAllVectorUrls((s) => {
        const unchangedData = s.filter((a) => a.source !== source);
        const updatedData = [...unchangedData, { source, url }];

        if (!deepEqual(s, updatedData)) {
          return updatedData;
        }
        return s;
      });
    },
    [setAllVectorUrls],
  );

  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const [legend, setLegend] = useState<JSX.Element | null>(null);

  const [renderedFeatures, setRenderedFeatures] = useState<RenderedFeatureType[]>([]);

  const [mapAlerts, setMapAlerts] = useState<
    {
      key: string;
      display: boolean;
      element: JSX.Element;
      priority: MapAlertPriority;
    }[]
  >([]);
  const mapAlert = useMemo(() => {
    return (
      [...mapAlerts].sort((a, b) => ((a.priority as number) - b.priority) as number).find((a) => a.display)?.element ??
      null
    );
  }, [mapAlerts]);
  const changeAlertDisplay = useCallback(
    (key: string, display: boolean, element: JSX.Element, priority: MapAlertPriority) => {
      setMapAlerts((s) => {
        const unchangedData = s.filter((a) => a.key !== key);
        return [
          ...unchangedData,
          {
            key,
            display,
            element,
            priority,
          },
        ];
      });
    },
    [setMapAlerts],
  );
  const removeAlertDisplay = useCallback(
    (key: string) => {
      setMapAlerts((s) => {
        return s.filter((a) => a.key !== key);
      });
    },
    [setMapAlerts],
  );

  const [mapBoundSettings, setMapBoundSettings] = useState<MapBoundSettings | null>(null);

  const [mapClickedFeatures, setMapClickedFeatures] = useState<MapClickType | null>(null);

  const [mapPopup, setMapPopup] = useState<MapPopupType | null>(null);

  const [polylines, setPolylines] = useState<GeoJSON.Feature<GeoJSON.Geometry>[]>([]);

  const [isMapRendering, setIsMapRendering] = useState<boolean>(false);

  const mapContextProviderValue: MapContextState = {
    isMapLoaded,
    setIsMapLoaded,
    mapStyle,
    setMapStyle,
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
    iconImages,
    setLayerIconImages,
    geoJsonData,
    setGeoJsonData,
    userDrawnPolygonData,
    setUserDrawnPolygonData,
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
    mapLocationSettings,
    setMapLocationSettings,
    isMapRendering,
    setIsMapRendering,
    drawPolygon,
    setDrawPolygon,
  };

  return <MapContext.Provider value={mapContextProviderValue}>{children}</MapContext.Provider>;
};

export default MapProvider;
