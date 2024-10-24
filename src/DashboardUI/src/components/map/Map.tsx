import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, {
  AnyLayer,
  AnySourceData,
  LngLat,
  NavigationControl,
} from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useAppContext } from '../../contexts/AppProvider';
import {
  defaultMapLocationData,
  useMapContext,
  MapSettings,
  MapStyle,
} from '../../contexts/MapProvider';
import mapConfig from '../../config/maps';
import { mdiMapMarker } from '@mdi/js';
import { Canvg, presets } from 'canvg';
import { useDrop } from 'react-dnd';
import { useDebounce, useDebounceCallback } from '@react-hook/debounce';
import { CustomShareControl } from './CustomShareControl';
import { CustomFitControl } from './CustomFitControl';
import ReactDOM from 'react-dom';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';

import './map.scss';

interface mapProps {
  handleMapDrawnPolygonChange?: (
    polygons: Feature<Geometry, GeoJsonProperties>[],
  ) => void;
  handleMapFitChange?: () => void;
}
// Fix transpile errors. Mapbox is working on a fix for this
(mapboxgl as any).workerClass =
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
const createMapMarkerIcon = (color: string) => {
  return `<svg viewBox="0 0 24 24" role="presentation" style="width: 40px; height: 40px;"><path d="${mdiMapMarker}" style="fill: ${color};"></path></svg>`;
};

function Map({ handleMapDrawnPolygonChange, handleMapFitChange }: mapProps) {
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
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [styleLoadRequired, setStyleLoadRequired] = useState(false);
  const [coords, setCoords] = useState(null as LngLat | null);
  const [drawControl, setDrawControl] = useState<MapboxDraw | null>(null);
  const [styleFlag, setStyleFlag] = useState(0);
  const currentMapPopup = useRef<mapboxgl.Popup | null>(null);

  const geocoderControl = useRef(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
    }),
  );

  const addSvgImage = async (
    map: mapboxgl.Map,
    id: string,
    svg: string,
  ): Promise<void> => {
    const canvas = new OffscreenCanvas(24, 24);
    const ctx = canvas.getContext('2d');
    if (ctx != null) {
      // ctx and presets.offscreen() don't match the types in the Canvg library.
      // ESLint is throwing an error here. Casting to any for now to get it to build.
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
    } else if (isAuthenticated) {
      geocoderControl.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        // Lots of missing properties here. Adding ESLint highlights the problem.
        // Casting to any for now to get it to build.
        mapboxgl: map as any,
      });
      map.addControl(geocoderControl.current);
    }
  };

  const mapboxDrawControl = (mapInstance: mapboxgl.Map) => {
    if (!handleMapDrawnPolygonChange) return;
    const dc = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapInstance.addControl(dc);

    const callback = () => {
      if (handleMapDrawnPolygonChange)
        handleMapDrawnPolygonChange(dc.getAll().features);
    };

    mapInstance.on('draw.create', callback);
    mapInstance.on('draw.update', callback);
    mapInstance.on('draw.delete', callback);

    setDrawControl(dc);
  };

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
      mapInstance.setCenter(
        new mapboxgl.LngLat(mapSettings.longitude, mapSettings.latitude),
      );
      mapInstance.zoomTo(mapSettings.zoomLevel);

      mapInstance.addControl(new NavigationControl({ showCompass: false }));

      if (handleMapFitChange)
        mapInstance.addControl(new CustomFitControl(handleMapFitChange));
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
        mapInstance.addSource(id, src as AnySourceData);
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
      return map
        .queryRenderedFeatures()
        .filter((a) => sourceIds.some((b) => a.source === b));
    });
  }, 500);

  const setIsMapRenderingDebounce = useDebounceCallback(
    setIsMapRendering,
    550,
    true,
  );

  useEffect(() => {
    if (!map) return;
    setMapRenderedFeatures(map);
    mapConfig.layers.forEach((a) => {
      map.on('click', a.id, (e) => {
        if (e.features && e.features.length > 0) {
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
          ReactDOM.render(
            mapPopup.element,
            document.getElementById('mapboxPopupId'),
          );
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
    (mapConfig as any).layers.forEach((a: AnyLayer) => {
      map.setLayoutProperty(
        a.id,
        'visibility',
        visibleLayers.some((b) => b === a.id) ? 'visible' : 'none',
      );
    });
  }, [map, visibleLayers, setMapRenderedFeatures]);

  const [debouncedStyleFlag] = useDebounce(styleFlag, 100);
  useEffect(() => {
    if (!map) return;
    const setStyleData = async (map: mapboxgl.Map, style: MapStyle) => {
      await new Promise((resolve) => {
        const currLayers = map.getStyle().layers;
        const currSources = map.getStyle().sources;
        map.once('styledata', () => {
          sourceIds?.forEach((sourceId) => {
            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, currSources?.[sourceId] as AnySourceData);
            }
          });
          layerIds?.forEach((layerId) => {
            if (!map.getLayer(layerId)) {
              map.addLayer(
                currLayers?.find((a) => a.id === layerId) as AnyLayer,
              );
            }
          });

          resolve(true);
        });
        map.setStyle(`mapbox://styles/mapbox/${style}`);
      });
    };
    const buildMap = async (map: mapboxgl.Map): Promise<void> => {
      const prevStyle = map.getStyle().metadata['mapbox:origin'];
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
  }, [
    map,
    mapStyle,
    layerIds,
    sourceIds,
    debouncedStyleFlag,
    setStyleLoadRequired,
  ]);

  useEffect(() => {
    if (styleLoadRequired && !isMapRendering) {
      setStyleLoadRequired(false);
      setStyleFlag(styleFlag + 1);
    }
  }, [
    styleFlag,
    styleLoadRequired,
    isMapRendering,
    setStyleLoadRequired,
    setStyleFlag,
  ]);

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
      if (source.type === 'vector') {
        if (source.url !== a.url) {
          source.setUrl(a.url);
        }
      }
    });
  }, [map, vectorUrls]);

  useEffect(() => {
    if (!map) return;
    for (const key in filters) {
      map.setFilter(key, filters[key]);
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
    if (!map || !mapBoundSettings || mapBoundSettings.LngLatBounds.length === 0)
      return;
    const bounds = new mapboxgl.LngLatBounds(
      mapBoundSettings.LngLatBounds[0],
      mapBoundSettings.LngLatBounds[0],
    );
    mapBoundSettings.LngLatBounds.forEach((x) => {
      bounds.extend(x);
    });
    map.fitBounds(bounds, {
      padding: mapBoundSettings.padding,
      maxZoom: mapBoundSettings.maxZoom,
    });
  }, [map, mapBoundSettings]);

  const [, dropRef] = useDrop({
    accept: 'nldiMapPoint',
    drop: () =>
      coords ? { latitude: coords.lat, longitude: coords.lng } : undefined,
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

  return (
    <div className="position-relative h-100">
      {coords && map && (
        <div className="map-coordinates">
          {coords.lat.toFixed(4)} {coords.lng.toFixed(4)}
        </div>
      )}
      {legend && map && <div className={`legend ${legendClass}`}>{legend}</div>}
      {map && mapAlert}
      <div id="map" className="map h-100" ref={dropRef}></div>
    </div>
  );
}

export default Map;
