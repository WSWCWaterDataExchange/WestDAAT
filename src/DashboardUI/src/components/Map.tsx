import mapboxgl, { AnyLayer, AnySourceImpl, LngLat, NavigationControl } from "mapbox-gl";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "../styles/map.scss";
import { AppContext, User } from "../AppProvider";
import { MapContext, MapStyle } from "./MapProvider";
import mapConfig from "../config/maps";
import { mdiMapMarker } from '@mdi/js';
import { Canvg, presets } from "canvg";
import { nldi } from "../config/constants";
import { useDrop } from "react-dnd";
import { useDebounceCallback } from "@react-hook/debounce";

// Fix transpile errors. Mapbox is working on a fix for this
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map() {
  const { user } = useContext(AppContext);
  const { legend, mapStyle, visibleLayers, geoJsonData, filters, circleColors, vectorUrls, mapAlert, fillColors, setRenderedFeatures } = useContext(MapContext);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState(null as LngLat | null);

  let geocoderControl = useRef(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  }));

  const addSvgImage = async (map: mapboxgl.Map, id: string, svg: string): Promise<void> => {
    const canvas = new OffscreenCanvas(24, 24);
    const ctx = canvas.getContext('2d');
    if (ctx != null) {
      const v = await Canvg.from(ctx, svg, presets.offscreen())
      await v.render()
      const blob = await canvas.convertToBlob()
      const pngUrl = URL.createObjectURL(blob);
      map.loadImage(pngUrl, (_, result) => {
        if (result) {
          map.addImage(id, result);
        }
      });
    }
  }

  const updateMapControls = (map: mapboxgl.Map, user: User | null) => {
    if (map.hasControl(geocoderControl.current) && !user) {
      map.removeControl(geocoderControl.current);
    } else if (user) {
      geocoderControl.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: map
      });
      map.addControl(geocoderControl.current);
    }
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [-100, 40],
      zoom: 4,
    });

    mapInstance.once("load", () => {
      mapInstance.addControl(new NavigationControl());
      addSvgImage(mapInstance, 'mapMarker', `<svg viewBox="0 0 24 24" role="presentation" style="width: 40px; height: 40px;"><path d="${mdiMapMarker}" style="fill: ${nldi.colors.mapMarker};"></path></svg>`);
      mapInstance.addControl(new mapboxgl.ScaleControl());
      mapInstance.on('mousemove', (e) => {
        setCoords(e.lngLat.wrap());
      });
      mapConfig.sources.forEach(a => {
        var { id, ...src } = a;
        mapInstance.addSource(id, src as AnySourceImpl)
      })
      mapConfig.layers.forEach((a: any) => {
        mapInstance.addLayer(a)
      })
      setMap(mapInstance);
    });
  }, [setMap]);/* eslint-disable-line *//* We don't want to run this when mapStyle updates */

  const sourceIds = useMemo(() => {
    return mapConfig.sources.map(a => a.id)
  }, [])
  const layerIds = useMemo(() => {
    return mapConfig.layers.map(a => a.id)
  }, [])

  const setMapRenderedFeatures = useDebounceCallback((map: mapboxgl.Map) => {
    setRenderedFeatures(s => {
      var sourceFeatures = map.queryRenderedFeatures().filter(a => sourceIds.some(b => a.source === b));
      return sourceFeatures;
    })
  }, 500)

  useEffect(() => {
    if (!map) return;
    setMapRenderedFeatures(map);
    map.on('idle', () => {
      setMapRenderedFeatures(map);
    });
  }, [map, setMapRenderedFeatures])

  useEffect(() => {
    if (!map) return;
    updateMapControls(map, user);
  }, [user, map]);

  useEffect(() => {
    if (!map) return;
    (mapConfig as any).layers.forEach((a: AnyLayer) => {
      map.setLayoutProperty(a.id, "visibility", visibleLayers.some(b => b === a.id) ? "visible" : "none")
    });
  }, [map, visibleLayers, setMapRenderedFeatures]);

  useEffect(() => {
    const setStyleData = async (map: mapboxgl.Map, style: MapStyle) => {
      await new Promise(resolve => {
        var currLayers = map.getStyle().layers;
        var currSources = map.getStyle().sources;
        map.once("styledata", () => {
          sourceIds.forEach(sourceId => {
            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, currSources?.[sourceId] as AnySourceImpl);
            }
          })
          layerIds?.forEach(layerId => {
            if (!map.getLayer(layerId)) {
              map.addLayer(currLayers?.find(a => a.id === layerId) as AnyLayer);
            }
          })
          resolve(true);
        });
        map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
      });
    }
    const buildMap = async (map: mapboxgl.Map): Promise<void> => {
      const prevStyle = map.getStyle().metadata["mapbox:origin"];
      if (mapStyle !== prevStyle) {
        await setStyleData(map, mapStyle)
      }
    }
    if (!map) return;
    buildMap(map);
  }, [map, mapStyle, layerIds, sourceIds]);

  useEffect(() => {
    if (!map) return;
    geoJsonData.forEach(a => {
      var source = map.getSource(a.source);
      if (source.type === 'geojson') {
        source.setData(a.data);
      }
    })
  }, [map, geoJsonData]);

  useEffect(() => {
    if (!map) return;
    vectorUrls.forEach(a => {
      var source = map.getSource(a.source);
      if (source.type === 'vector') {
        if (source.url !== a.url) {
          source.setUrl(a.url);
        }
      }
    })
  }, [map, vectorUrls]);

  useEffect(() => {
    if (!map) return;
    for (let key in filters) {
      map.setFilter(key, filters[key]);
    }
  }, [map, filters]);

  useEffect(() => {
    if (!map) return;
    for (let key in circleColors) {
      map.setPaintProperty(key, "circle-color", circleColors[key]);
    }
  }, [map, circleColors]);

  useEffect(() => {
    if (!map) return;
    for (let key in fillColors) {
      map.setPaintProperty(key, "fill-color", fillColors[key]);
    }
  }, [map, fillColors]);

  const [, dropRef] = useDrop({
    accept: 'nldiMapPoint',
    drop: () => (coords ? { latitude: coords.lat, longitude: coords.lng } : undefined),
    collect: () => { }
  })

  const legendClass = useMemo(() => {
    return {
      [MapStyle.Dark]: "legend-dark",
      [MapStyle.Light]: "legend-light",
      [MapStyle.Outdoor]: "legend-light",
      [MapStyle.Street]: "legend-light",
      [MapStyle.Satellite]: "legend-light",
    }[mapStyle];
  }, [mapStyle])

  return (
    <div className="position-relative h-100">
      {coords && map &&
        <div className="map-coordinates">{coords.lat.toFixed(4)} {coords.lng.toFixed(4)}</div>
      }
      {legend && map &&
        <div className={`legend ${legendClass}`}>
          {legend}
        </div>
      }
      {map &&
        mapAlert
      }
      <div id="map" className="map h-100" ref={dropRef}></div>
    </div>
  );


}

export default Map;
