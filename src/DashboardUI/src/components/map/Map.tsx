import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, {
  LayerSpecification,
  GeoJSONSourceSpecification,
  LngLat,
  NavigationControl,
  GeoJSONSource,
} from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useAppContext } from '../../contexts/AppProvider';
import {
  defaultMapLocationData,
  MapSettings,
  MapStyle,
  RenderedFeatureType,
  useMapContext,
} from '../../contexts/MapProvider';
import mapConfig, { mapLayerNames, mapSourceNames } from '../../config/maps';
import { mdiAlert, mdiMapMarker, mdiVectorCircle, mdiVectorRectangle } from '@mdi/js';
import { Canvg, presets } from 'canvg';
import { useDrop } from 'react-dnd';
import { useDebounce, useDebounceCallback } from '@react-hook/debounce';
import { CustomShareControl } from './CustomShareControl';
import { CustomFitControl } from './CustomFitControl';
import ReactDOM from 'react-dom';
import { FeatureCollection, Feature, GeoJsonProperties, Geometry, Point } from 'geojson';
import { useHomePageContext } from '../home-page/Provider';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { CustomCircleDrawMode } from './CustomCircleDrawMode';
import { CustomDirectSelectMode } from './CustomDirectSelectMode/CustomDirectSelectMode';
import { CustomRectangleDrawMode } from './CustomRectangleDrawMode';
import { Alert } from 'react-bootstrap';
import Icon from '@mdi/react';
import { isFeatureEnabled } from '../../config/features';

import './map.scss';
import { ExtendedMapboxDraw } from './ExtendedMapboxDraw';

interface mapProps {
  handleMapDrawnPolygonChange?: (polygons: Feature<Geometry, GeoJsonProperties>[]) => void;
  handleMapFitChange?: () => void;
  polygonLabelFeatures?: Feature<Point, GeoJsonProperties>[];
  isConsumptiveUseAlertEnabled: boolean;
  isGeocoderInputFeatureEnabled: boolean;
}

const createMapMarkerIcon = (color: string) => {
  return `<svg viewBox="0 0 24 24" role="presentation" style="width: 40px; height: 40px;"><path d="${mdiMapMarker}" style="fill: ${color};"></path></svg>`;
};

function Map({
  handleMapDrawnPolygonChange,
  handleMapFitChange,
  polygonLabelFeatures,
  isConsumptiveUseAlertEnabled,
  isGeocoderInputFeatureEnabled,
}: mapProps) {
  const {
    authenticationContext: { isAuthenticated },
  } = useAppContext();
  const {
    legend,
    mapStyle,
    visibleLayers,
    geoJsonData,
    filters,
    circleColors,
    circleRadii,
    circleSortKeys,
    vectorUrls,
    mapAlert,
    fillColors,
    iconImages,
    mapPopup,
    mapBoundSettings,
    mapLocationSettings,
    polylines,
    isMapRendering,
    setIsMapLoaded,
    setMapLocationSettings,
    setRenderedFeatures,
    setMapClickedFeatures,
    setIsMapRendering,
  } = useMapContext();

  const { uploadedGeoJSON } = useHomePageContext();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState<LngLat | null>(null);
  const [drawControl, setDrawControl] = useState<MapboxDraw | null>(null);
  const [styleFlag, setStyleFlag] = useState(0);
  const [styleLoadRequired, setStyleLoadRequired] = useState(false);
  const currentMapPopup = useRef<mapboxgl.Popup | null>(null);

  const drawControlStateRef = useRef<MapboxDraw | null>(null);

  const geocoderControl = useRef(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
    }),
  );

  const addSvgImage = async (map: mapboxgl.Map, id: string, svg: string): Promise<void> => {
    const canvas = new OffscreenCanvas(24, 24);
    const ctx = canvas.getContext('2d');
    if (ctx != null) {
      const v = await Canvg.from(ctx as any, svg, presets.offscreen() as any);
      await v.render();

      // Build errors here without the any case. We need to update some packages.
      const blob = await (canvas as any).convertToBlob();
      const pngUrl = URL.createObjectURL(blob);
      map.loadImage(pngUrl, (_, result) => {
        if (result && !map.hasImage(id)) {
          map.addImage(id, result);
        }
      });
    }
  };

  const updateMapControls = (map: mapboxgl.Map, isAuthenticated: boolean) => {
    if (map.hasControl(geocoderControl.current) && !isAuthenticated) {
      map.removeControl(geocoderControl.current);
    } else if (isAuthenticated && isGeocoderInputFeatureEnabled) {
      geocoderControl.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        // Lots of missing properties here. Adding ESLint highlights the problem.
        // Casting to any for now to get it to build.
        mapboxgl: map as any,
      });
      map.addControl(geocoderControl.current);
    }
  };

  const mapboxDrawControl = (mapInstance: mapboxgl.Map): void => {
    if (!handleMapDrawnPolygonChange) {
      return;
    }
    const dc = new ExtendedMapboxDraw({
      props: {
        displayControlsDefault: false,
        controls: {
          // These controls must be enabled to allow the custom draw modes to work.
          // Enabling this functionality also has the side effect of adding the corresponding buttons to the draw bar
          polygon: true,
          trash: true,
        },
        modes: {
          ...MapboxDraw.modes,
          direct_select: CustomDirectSelectMode,
          draw_circle: CustomCircleDrawMode,
          draw_rectangle: CustomRectangleDrawMode,
        },
      },
      // these buttons are rendered in reverse order
      buttons: [
        {
          on: 'click',
          title: 'Rectangle tool',
          buttonIconPath: mdiVectorRectangle,
          action: () => {
            drawControlStateRef.current?.changeMode('draw_rectangle');
          },
        },
        {
          on: 'click',
          title: 'Circle tool',
          buttonIconPath: mdiVectorCircle,
          action: () => {
            drawControlStateRef.current?.changeMode('draw_circle');
          },
        },
      ],
    });

    mapInstance.addControl(dc);

    const callback = () => {
      if (handleMapDrawnPolygonChange) {
        handleMapDrawnPolygonChange(dc.getAll().features);
      }
    };

    mapInstance.on('draw.create', callback);
    mapInstance.on('draw.update', callback);
    mapInstance.on('draw.delete', callback);

    setDrawControl(dc);

    // make stateRef always have the current drawControl.
    // this is done so that the inline functions which reference drawControl can always have the latest reference
    drawControlStateRef.current = dc;
  };

  const uploadGeoJsonToMapbox = (geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>) => {
    if (drawControl && geoJsonData.features) {
      drawControl.deleteAll();
      geoJsonData.features.forEach((feature: Feature<Geometry, GeoJsonProperties>) => {
        drawControl.add(feature);
      });

      const features = drawControl.getAll().features;
      if (features.length > 0) {
        handleMapDrawnPolygonChange?.(features);
      }
    }
  };

  useEffect(() => {
    if (map && uploadedGeoJSON) {
      uploadGeoJsonToMapbox(uploadedGeoJSON);
    }
  }, [map, uploadedGeoJSON]);

  useEffect(() => {
    setIsMapRendering(true);
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || '';
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [-100, 40],
      zoom: 4,
    });

    mapInstance.on('styleimagemissing', (e) => {
      const groups = (e.id as string).match(/^mapMarker(?<color>.+)$/)?.groups;
      if (groups?.color) {
        addSvgImage(mapInstance, e.id, createMapMarkerIcon(groups.color));
      }
    });

    mapInstance.once('load', () => {
      const mapSettings: MapSettings = defaultMapLocationData;
      mapInstance.setCenter(new mapboxgl.LngLat(mapSettings.longitude, mapSettings.latitude));
      mapInstance.zoomTo(mapSettings.zoomLevel);

      mapInstance.addControl(new NavigationControl({ showCompass: false }));

      if (handleMapFitChange) mapInstance.addControl(new CustomFitControl(handleMapFitChange));
      mapInstance.addControl(new CustomShareControl());
      mapInstance.addControl(new mapboxgl.ScaleControl());

      mapboxDrawControl(mapInstance);

      mapInstance.on('render', () => {
        setIsMapRenderingDebounce(true);
      });
      mapInstance.on('idle', () => {
        setMapRenderedFeatures(mapInstance);
        setIsMapRenderingDebounce(false);
      });

      const locationChangedEvent = () => {
        const round = (num: number) => {
          return Math.round((num + Number.EPSILON) * 100000) / 100000;
        };
        const mapSettings: MapSettings = {
          zoomLevel: mapInstance.getZoom(),
          latitude: round(mapInstance.getCenter().lat),
          longitude: round(mapInstance.getCenter().lng),
        };
        setMapLocationSettings(mapSettings);
      };
      mapInstance.on('dragend', locationChangedEvent);
      mapInstance.on('zoomend', locationChangedEvent);

      mapInstance.on('mousemove', (e) => {
        setCoords(e.lngLat.wrap());
      });

      mapConfig.sources.forEach((a) => {
        const { id, ...src } = a;
        mapInstance.addSource(id, src as GeoJSONSourceSpecification);
      });

      mapConfig.layers.forEach((a: any) => {
        mapInstance.addLayer(a);
      });
      mapInstance.resize();
      setMap(mapInstance);
    });
  }, [setMap]);

  useEffect(() => {
    setIsMapLoaded(!!map);
  }, [map, setIsMapLoaded]);

  useEffect(() => {
    drawControl?.deleteAll();
    for (const element of polylines) {
      drawControl?.add(element);
    }
  }, [polylines, drawControl]);

  const sourceIds = useMemo(() => {
    return mapConfig.sources.map((a) => a.id);
  }, []);
  const layerIds = useMemo(() => {
    return mapConfig.layers.map((a) => a.id);
  }, []);

  const setMapRenderedFeatures = useDebounceCallback((map: mapboxgl.Map) => {
    setRenderedFeatures(() => {
      return map.queryRenderedFeatures().filter((feature) => {
        return feature.source && sourceIds.includes(feature.source);
      }) as RenderedFeatureType[];
    });
  }, 500);

  const setIsMapRenderingDebounce = useDebounceCallback(setIsMapRendering, 550, true);

  useEffect(() => {
    if (!map) return;
    setMapRenderedFeatures(map);
    mapConfig.layers.forEach((a) => {
      map.on('click', a.id, (e) => {
        if (e.features && e.features.length > 0) {
          // prevent click event if one of the drawing tools are active
          if (drawControl?.getMode().startsWith('draw')) {
            return;
          }

          setMapClickedFeatures({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
            layer: a.id,
            features: e.features,
          });
        }
      });

      map.on('mouseenter', a.id, (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
        }
      });

      map.on('mouseleave', a.id, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, [map, setMapRenderedFeatures, setMapClickedFeatures]);

  useEffect(() => {
    if (!map) return;
    if (currentMapPopup.current) {
      currentMapPopup.current.remove();
    }
    if (mapPopup) {
      currentMapPopup.current = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat({
          lat: mapPopup.latitude,
          lng: mapPopup.longitude,
        })
        .setHTML("<div id='mapboxPopupId'></div>")
        .once('open', () => {
          const popupContainer = document.getElementById('mapboxPopupId');
          const root = createRoot(popupContainer!);
          root.render(mapPopup.element);
        })
        .addTo(map);
    } else {
      setMapClickedFeatures(null);
    }
  }, [map, mapPopup, setMapClickedFeatures]);

  useEffect(() => {
    if (!map) return;
    updateMapControls(map, isAuthenticated);
  }, [map, isAuthenticated]);

  useEffect(() => {
    if (!map) return;
    (mapConfig as any).layers.forEach((a: LayerSpecification) => {
      map.setLayoutProperty(a.id, 'visibility', visibleLayers.some((b) => b === a.id) ? 'visible' : 'none');
    });
  }, [map, visibleLayers, setMapRenderedFeatures]);

  const [debouncedStyleFlag, setDebouncedStyleFlag] = useDebounce(styleFlag, 100);

  useEffect(() => {
    setDebouncedStyleFlag(styleFlag);
  }, [styleFlag]);

  useEffect(() => {
    if (!map) return;
    const setStyleData = async (map: mapboxgl.Map, style: MapStyle) => {
      await new Promise((resolve) => {
        const currLayers = map.getStyle()!.layers;
        const currSources = map.getStyle()!.sources;

        map.once('styledata', () => {
          sourceIds?.forEach((sourceId) => {
            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, currSources?.[sourceId] as GeoJSONSourceSpecification);
            }
          });
          layerIds?.forEach((layerId) => {
            if (!map.getLayer(layerId)) {
              map.addLayer(currLayers?.find((a) => a.id === layerId) as LayerSpecification);
            }
          });

          resolve(true);
        });
        map.setStyle(`mapbox://styles/mapbox/${style}`);
      });
    };
    const buildMap = async (map: mapboxgl.Map): Promise<void> => {
      const style = map.getStyle();

      if (!style || !style.metadata) {
        console.warn('Map style or metadata is not available.');
        return;
      }

      const metadata = style.metadata as { [key: string]: any };
      const prevStyle = metadata['mapbox:origin'];

      if (mapStyle !== prevStyle) {
        await setStyleData(map, mapStyle);
      }
    };
    const buildStyleIfLoaded = () => {
      if (map.isStyleLoaded()) {
        buildMap(map);
      } else {
        setStyleLoadRequired(true);
      }
    };
    buildStyleIfLoaded();
  }, [map, mapStyle, layerIds, sourceIds, debouncedStyleFlag, setStyleLoadRequired]);

  useEffect(() => {
    if (styleLoadRequired && !isMapRendering) {
      setStyleLoadRequired(false);
      setStyleFlag(styleFlag + 1);
    }
  }, [styleFlag, styleLoadRequired, isMapRendering, setStyleLoadRequired, setStyleFlag]);

  useEffect(() => {
    if (!map) return;
    geoJsonData.forEach((a) => {
      const source = map.getSource(a.source);
      if (source?.type === 'geojson') {
        source.setData(a.data);
      }
    });
  }, [map, geoJsonData]);

  useEffect(() => {
    if (!map) return;
    vectorUrls.forEach((a) => {
      const source = map.getSource(a.source);
      if (source && source.type === 'vector') {
        if ((source as mapboxgl.VectorTileSource).url !== a.url) {
          (source as mapboxgl.VectorTileSource).setUrl(a.url);
        }
      }
    });
  }, [map, vectorUrls]);

  useEffect(() => {
    if (!map) return;
    for (const key in filters) {
      const filter = filters[key];
      if (filter) {
        map.setFilter(key, filter as mapboxgl.FilterSpecification);
      } else {
        map.setFilter(key, null);
      }
    }
  }, [map, filters]);

  useEffect(() => {
    if (!map) return;
    for (const key in circleColors) {
      map.setPaintProperty(key, 'circle-color', circleColors[key]);
    }
  }, [map, circleColors]);

  useEffect(() => {
    if (!map) return;
    for (const key in circleRadii) {
      map.setPaintProperty(key, 'circle-radius', circleRadii[key]);
    }
  }, [map, circleRadii]);

  useEffect(() => {
    if (!map) return;
    for (const key in circleSortKeys) {
      map.setLayoutProperty(key, 'circle-sort-key', circleSortKeys[key]);
    }
  }, [map, circleSortKeys]);

  useEffect(() => {
    if (!map) return;
    for (const key in fillColors) {
      map.setPaintProperty(key, 'fill-color', fillColors[key]);
    }
  }, [map, fillColors]);

  useEffect(() => {
    if (!map) return;
    for (const key in iconImages) {
      map.setLayoutProperty(key, 'icon-image', iconImages[key]);
    }
  }, [map, iconImages]);

  useEffect(() => {
    if (!map) return;
    if (mapLocationSettings) {
      map.setCenter({
        lat: mapLocationSettings.latitude,
        lng: mapLocationSettings.longitude,
      });
      map.setZoom(mapLocationSettings.zoomLevel);
    }
  }, [map, mapLocationSettings]);

  useEffect(() => {
    if (!map || !mapBoundSettings || mapBoundSettings.LngLatBounds.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds(mapBoundSettings.LngLatBounds[0], mapBoundSettings.LngLatBounds[0]);
    mapBoundSettings.LngLatBounds.forEach((x) => {
      bounds.extend(x);
    });
    map.fitBounds(bounds, {
      padding: mapBoundSettings.padding,
      maxZoom: mapBoundSettings.maxZoom,
    });
  }, [map, mapBoundSettings]);

  useEffect(() => {
    if (!map || !polygonLabelFeatures) {
      return;
    }

    const source = map.getSource<GeoJSONSource>(mapSourceNames.userDrawnPolygonLabelsGeoJson);

    source?.setData({
      type: 'FeatureCollection',
      features: polygonLabelFeatures,
    });

    // another useEffect sets this layer's visibility is being set to `none`. Here we override that to set it back to `visible`
    map.setLayoutProperty(mapLayerNames.userDrawnPolygonLabelsLayer, 'visibility', 'visible');
  }, [map, polygonLabelFeatures]);

  const [, dropRef] = useDrop({
    accept: 'nldiMapPoint',
    drop: () => (coords ? { latitude: coords.lat, longitude: coords.lng } : undefined),
    collect: () => {},
  });

  const legendClass = useMemo(() => {
    return {
      [MapStyle.Dark]: 'legend-dark',
      [MapStyle.Light]: 'legend-light',
      [MapStyle.Outdoor]: 'legend-light',
      [MapStyle.Street]: 'legend-light',
      [MapStyle.Satellite]: 'legend-light',
    }[mapStyle];
  }, [mapStyle]);

  const shouldDisplayConsumptiveUseAlert =
    isFeatureEnabled('conservationEstimationTool') && isConsumptiveUseAlertEnabled;
  const consumptiveUseAlert = (
    <div>
      <div className="consumptive-use-alert-container">
        <Alert variant="success" className="m-0" dismissible>
          <div className="d-flex gap-3 align-items-center">
            <div>
              <Icon path={mdiAlert} size="1.25em" />
            </div>
            <div>
              Find and click on your Water Right to see more detailed information and estimate consumptive use using
              OpenET
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );

  return (
    <div className="position-relative h-100">
      {shouldDisplayConsumptiveUseAlert && consumptiveUseAlert}
      {coords && map && (
        <div className="map-coordinates">
          {coords.lat.toFixed(4)} {coords.lng.toFixed(4)}
        </div>
      )}
      {legend && map && <div className={`legend ${legendClass}`}>{legend}</div>}

      {map && mapAlert}
      <div
        id="map"
        className="map h-100"
        ref={(el) => {
          dropRef(el);
        }}
      ></div>
      <ToastContainer />
    </div>
  );
}

export default Map;
