import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  MapExportOptions,
  MapSettings,
  MapStyle,
  RenderedFeatureType,
  useMapContext,
} from '../../contexts/MapProvider';
import mapConfig, { mapLayerNames, mapSourceNames } from '../../config/maps';
import { mdiAlert, mdiMapMarker, mdiVectorCircle, mdiVectorPolygon, mdiVectorRectangle } from '@mdi/js';
import { Canvg, presets } from 'canvg';
import { useDrop } from 'react-dnd';
import { useDebounce, useDebounceCallback } from '@react-hook/debounce';
import { CustomShareControl } from './CustomShareControl';
import { CustomFitControl } from './CustomFitControl';
import { FeatureCollection, Feature, GeoJsonProperties, Geometry, Point } from 'geojson';
import { useHomePageContext } from '../home-page/Provider';
import { createRoot } from 'react-dom/client';
import { toast } from 'react-toastify';
import { CustomCircleDrawMode } from './CustomCircleDrawMode';
import { CustomDirectSelectMode } from './CustomDirectSelectMode/CustomDirectSelectMode';
import { CustomRectangleDrawMode } from './CustomRectangleDrawMode';
import Icon from '@mdi/react';
import { isFeatureEnabled } from '../../config/features';
import { DrawBarButton, ExtendedMapboxDraw } from './ExtendedMapboxDraw';
import truncate from '@turf/truncate';
import Alert from 'react-bootstrap/esm/Alert';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import Spinner from 'react-bootstrap/esm/Spinner';

import './map.scss';

interface MapProps {
  handleMapDrawnPolygonChange?: (polygons: Feature<Geometry, GeoJsonProperties>[]) => void;
  handleMapFitChange?: () => void;
  conservationApplicationPolygonLabelFeatures?: Feature<Point, GeoJsonProperties>[];
  conservationApplicationPointLabelFeature?: Feature<Point, GeoJsonProperties> | undefined;
  isConsumptiveUseAlertEnabled: boolean;
  isGeocoderInputFeatureEnabled: boolean;
  isControlLocationSelectionToolDisplayed?: boolean;
  showLoading?: boolean;
}

const createMapMarkerIcon = (color: string) => {
  return `<svg viewBox="0 0 24 24" role="presentation" style="width: 40px; height: 40px;"><path d="${mdiMapMarker}" style="fill: ${color};"></path></svg>`;
};

function Map({
  handleMapDrawnPolygonChange,
  handleMapFitChange,
  conservationApplicationPolygonLabelFeatures,
  conservationApplicationPointLabelFeature,
  isConsumptiveUseAlertEnabled,
  isGeocoderInputFeatureEnabled,
  isControlLocationSelectionToolDisplayed,
  showLoading,
}: MapProps) {
  const {
    authenticationContext: { isAuthenticated },
  } = useAppContext();
  const {
    legend,
    mapStyle,
    visibleLayers,
    geoJsonData,
    userDrawnPolygonData,
    isControlLocationSelectionToolEnabled,
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
    setUserDrawnPolygonData,
    addGeometriesToMap,
    setExportToPngFn,
  } = useMapContext();

  const { uploadedGeoJSON } = useHomePageContext();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState<LngLat | null>(null);
  const [drawControl, setDrawControl] = useState<MapboxDraw | null>(null);
  const [styleFlag, setStyleFlag] = useState(0);
  const [styleLoadRequired, setStyleLoadRequired] = useState(false);
  const currentMapPopup = useRef<mapboxgl.Popup | null>(null);

  const drawControlStateRef = useRef<MapboxDraw | null>(null);
  const isControlLocationSelectionToolEnabledRef = useRef<boolean>(isControlLocationSelectionToolEnabled);

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

  useEffect(() => {
    isControlLocationSelectionToolEnabledRef.current = isControlLocationSelectionToolEnabled;
  }, [isControlLocationSelectionToolEnabled]);

  const mapboxDrawControl = (mapInstance: mapboxgl.Map): void => {
    if (!handleMapDrawnPolygonChange) {
      return;
    }

    const controlLocationSelectionToolDrawBarButton: DrawBarButton = {
      on: 'click',
      title: 'Control Location tool',
      buttonIconPath: mdiMapMarker,
      action: () => {
        // cannot reference the state variable directly inside of an inline function
        const isEnabled: boolean = isControlLocationSelectionToolEnabledRef.current;
        if (isEnabled) {
          drawControlStateRef.current?.changeMode('draw_point');
        } else {
          toast.error('Only one Control Location is allowed.');
        }
      },
    };

    const dc = new ExtendedMapboxDraw({
      props: {
        displayControlsDefault: false,
        controls: {
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
          title: 'Polygon tool',
          buttonIconPath: mdiVectorPolygon,
          action: () => {
            drawControlStateRef.current?.changeMode('draw_polygon');
          },
        },
        ...(isControlLocationSelectionToolDisplayed ? [controlLocationSelectionToolDrawBarButton] : []),
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
        const allFeatures = dc.getAll().features;

        for (const feature of allFeatures) {
          // limit decimal precision
          feature.geometry = truncate(feature.geometry, { precision: 6 });
        }

        handleMapDrawnPolygonChange(allFeatures);
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

  const addGeometriesToMapCallback = useCallback(
    (geoJsonData: Feature<Geometry, GeoJsonProperties>[]) => {
      if (drawControl && geoJsonData.length > 0) {
        geoJsonData.forEach((feature: Feature<Geometry, GeoJsonProperties>) => {
          drawControl.add(feature);
        });

        const allFeatures = drawControl.getAll().features;
        if (allFeatures.length > 0) {
          handleMapDrawnPolygonChange?.(allFeatures);
        }
      }
    },
    [drawControl, handleMapDrawnPolygonChange],
  );

  useEffect(() => {
    addGeometriesToMap.current = addGeometriesToMapCallback;
  }, [addGeometriesToMapCallback]);

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
    map.on(
      'click',
      mapConfig.layers.map((m) => m.id),
      (e) => {
        if (e.features && e.features.length > 0) {
          // prevent click event if one of the drawing tools are active
          if (drawControl?.getMode().startsWith('draw')) {
            return;
          }

          setMapClickedFeatures({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
            layer: '',
            features: e.features,
          });
        }
      },
    );

    mapConfig.layers.forEach((a) => {
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
      let { latitude, longitude } = mapPopup;
      const bounds = map.getBounds();
      if (bounds && !bounds.contains([longitude, latitude])) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        longitude = Math.max(sw.lng, Math.min(ne.lng, longitude));
        latitude = Math.max(sw.lat, Math.min(ne.lat, latitude));
      }

      currentMapPopup.current = new mapboxgl.Popup({
        closeOnClick: false,
      })
        .setLngLat({ lat: latitude, lng: longitude })
        .setHTML("<div id='mapboxPopupId'></div>")
        .addTo(map);

      // Dynamically updates the position and anchor of the map popup to ensure it remains visible within the map's current viewport.
      // It calculates the popup's position based on the view's dimensions, the popup's size, and the user's click location.
      // Also adjusts the anchor of the popup to improve UI when dragging around the map
      const updatePopupPosition = () => {
        if (!currentMapPopup.current || !map) return;

        const lngLat = currentMapPopup.current.getLngLat();
        const clickPoint = map.project([lngLat.lng, lngLat.lat]);
        const mapWidth = map.getContainer().clientWidth;
        const mapHeight = map.getContainer().clientHeight;
        const popupElement = currentMapPopup.current.getElement();
        const popupWidth = popupElement ? popupElement.offsetWidth : 250;
        const popupHeight = popupElement ? popupElement.offsetHeight : 425;
        const edgeMargin = 500;
        let anchor: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom';

        if (clickPoint.y + popupHeight + edgeMargin > mapHeight) {
          anchor = 'top';
        } else if (clickPoint.y - popupHeight - edgeMargin < 0) {
          anchor = 'bottom';
        }

        if (clickPoint.x + popupWidth / 2 + edgeMargin > mapWidth) {
          anchor = anchor === 'top' ? 'top-left' : 'bottom-left';
        } else if (clickPoint.x - popupWidth / 2 - edgeMargin < 0) {
          anchor = anchor === 'top' ? 'top-right' : 'bottom-right';
        }

        currentMapPopup.current.setOffset([0, 0]);
        (currentMapPopup.current as any)._update(anchor);
      };

      const popupContainer = document.getElementById('mapboxPopupId');
      if (popupContainer) {
        const root = createRoot(popupContainer);
        root.render(mapPopup.element);
        setTimeout(() => {
          updatePopupPosition();
        }, 10);
      }

      map.on('move', updatePopupPosition);
      map.on('zoom', updatePopupPosition);

      return () => {
        map.off('move', updatePopupPosition);
        map.off('zoom', updatePopupPosition);
        if (currentMapPopup.current) {
          currentMapPopup.current.remove();
        }
      };
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

        // cast to `any` is necessary because of an property being incorrectly required on the actual type
        const mapOptions = {
          diff: false,
        } as any;
        map.setStyle(`mapbox://styles/mapbox/${style}`, mapOptions);
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
    if (!map || !drawControl || isMapRendering) {
      return;
    }

    const existingPolygons = drawControl?.getAll() ?? [];
    const newPolygons = userDrawnPolygonData.filter(
      (polygon) => !existingPolygons.features.some((f) => f.id === polygon.id),
    );

    if (newPolygons.length === 0) {
      return;
    }

    map.once('idle', () => {
      while (!map.isStyleLoaded()) {
        continue;
      }
      newPolygons.forEach(drawControl.add);

      // clear the polygons from the state
      setUserDrawnPolygonData([]);
    });
  }, [map, isMapRendering, drawControl, userDrawnPolygonData]);

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

    // initialize the bounding box with the first point, then extend it with every point
    const boundsStartingPoint = mapBoundSettings.LngLatBounds[0];
    const bounds = new mapboxgl.LngLatBounds(boundsStartingPoint, boundsStartingPoint);
    mapBoundSettings.LngLatBounds.forEach((x) => {
      bounds.extend(x);
    });

    map.once('idle', () => {
      try {
        // `fitBounds` throws an error if the padding is too high
        map.fitBounds(bounds, {
          padding: mapBoundSettings.padding,
          maxZoom: mapBoundSettings.maxZoom,
          duration: mapBoundSettings.duration ?? 5000,
        });
      } catch {
        map.fitBounds(bounds, {
          padding: 0,
          maxZoom: mapBoundSettings.maxZoom,
          duration: mapBoundSettings.duration ?? 5000,
        });
      }
    });
  }, [map, mapBoundSettings]);

  useEffect(() => {
    if (!map || !conservationApplicationPolygonLabelFeatures) {
      return;
    }

    const polygonSource = map.getSource<GeoJSONSource>(mapSourceNames.userDrawnPolygonLabelsGeoJson);
    polygonSource?.setData({
      type: 'FeatureCollection',
      features: conservationApplicationPolygonLabelFeatures,
    });

    // another useEffect sets this layer's visibility is being set to `none`. Here we override that to set it back to `visible`
    map.setLayoutProperty(mapLayerNames.userDrawnPolygonLabelsLayer, 'visibility', 'visible');
  }, [map, conservationApplicationPolygonLabelFeatures]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const pointSource = map.getSource<GeoJSONSource>(mapSourceNames.userDrawnPointLabelsGeoJson);
    pointSource?.setData({
      type: 'FeatureCollection',
      features: conservationApplicationPointLabelFeature ? [conservationApplicationPointLabelFeature] : [],
    });

    // another useEffect sets this layer's visibility is being set to `none`. Here we override that to set it back to `visible`
    map.setLayoutProperty(mapLayerNames.userDrawnPointLabelsLayer, 'visibility', 'visible');
  }, [map, conservationApplicationPointLabelFeature]);

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

  const mapLoading = (
    <div
      style={{ zIndex: 1000 }}
      className={`w-100 h-100 position-absolute bg-white d-flex flex-column justify-content-center align-items-center`}
    >
      <Placeholder as="div" animation="glow" className="w-100 h-100 position-absolute">
        <Placeholder xs={12} className="w-100 h-100" />
      </Placeholder>
      <Spinner animation="border" className="text-primary" />
    </div>
  );

  useEffect(() => {
    if (!isMapRendering && map) {
      map.once('idle', () => {
        setExportToPngFn(() => (options: MapExportOptions) => {
          const promise = new Promise<Blob | null>((resolve, reject) => {
            const mapContainer = document.getElementById('map');

            const originalWidth = mapContainer?.style.width;
            const originalHeight = mapContainer?.style.height;

            if (!mapContainer) {
              reject(new Error('Map container not found'));
              return;
            }

            // resize component for standard size screenshot
            mapContainer.style.width = options.width + 'px';
            mapContainer.style.height = options.height + 'px';
            mapContainer.classList.remove('h-100');
            map.resize();

            // fit map to bounding box set by the displayed features
            const displayedFeatures = drawControl!.getAll().features;
            if (displayedFeatures.length === 0) {
              reject(new Error('No features to display'));
              return;
            }

            const bounds = new mapboxgl.LngLatBounds();
            displayedFeatures.forEach((feature) => {
              // only supports these geometries
              if (feature.geometry.type === 'Point') {
                bounds.extend(feature.geometry.coordinates as [number, number]);
              } else if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates[0].forEach((coord) => {
                  bounds.extend(coord as [number, number]);
                });
              } else {
                console.error(
                  'Unsupported geometry type:',
                  feature.geometry.type,
                  'static map generation is not guaranteed to include this shape',
                );
              }
            });

            map.fitBounds(bounds, {
              padding: 25,
              maxZoom: 16,
              duration: 0,
            });

            map.once('idle', async () => {
              const canvas = map.getCanvas();
              canvas.toBlob((blob: Blob | null) => {
                // reset style changes
                mapContainer.style.width = originalWidth!;
                mapContainer.style.height = originalHeight!;
                mapContainer.classList.add('h-100');
                map.resize();

                // return result
                resolve(blob);
              });
            });
          });

          return promise;
        });
      });
    }
  }, [isMapRendering]);

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

      {showLoading && mapLoading}

      <div
        id="map"
        className="map h-100"
        ref={(el) => {
          dropRef(el);
        }}
      ></div>
    </div>
  );
}

export default Map;
