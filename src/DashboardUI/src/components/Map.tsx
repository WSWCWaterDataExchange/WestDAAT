import mapboxgl, { LngLat, NavigationControl } from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import "../styles/map.scss";
import { AppContext, User } from "../AppProvider";
import { MapContext } from "./MapProvider";
import usePrevious from "../hooks/usePrevious";
import { mdiMapMarker, mdiRhombus, mdiCircleOutline, mdiCircle } from '@mdi/js';
import { Canvg, presets } from "canvg";
import { nldi } from "../config/constants";
import { useDrop } from "react-dnd";

// Fix transpile errors. Mapbox is working on a fix for this
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map() {

  const { user } = useContext(AppContext);
  const { map, setCurrentMap, layers, sources, legend } = useContext(MapContext);
  const prevSources = usePrevious(sources?.map(a => a.id));
  const prevLayers = usePrevious(layers?.map(a => a.id));
  const [coords, setCoords] = useState(null as LngLat | null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const setMap = useRef(setCurrentMap);
  const navControl = useRef(new NavigationControl());
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
      map.loadImage(pngUrl, (err, result) => {
        if (result) {
          map.addImage(id, result);
        }
      });
    }
  }

  useEffect(() => {
    if (!map) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        center: [-100, 40],
        zoom: 4,
      });
      map.addControl(new mapboxgl.ScaleControl());
      map.on('mousemove', (e) => {
        setCoords(e.lngLat.wrap());
      });
      setMap.current(map);

      map.on("load", () => {
        addSvgImage(map, 'mapMarker', `<svg viewBox="0 0 24 24" role="presentation" style="width: 40px; height: 40px;"><path d="${mdiMapMarker}" style="fill: ${nldi.colors.mapMarker};"></path></svg>`);
        addSvgImage(map, 'mapNldiUsgs', `<svg viewBox="0 0 24 24" role="presentation" style="width: 12px; height: 12px;"><path d="${mdiRhombus}" style="fill: ${nldi.colors.usgs};"></path></svg>`);
        addSvgImage(map, 'mapNldiEpa', `<svg viewBox="0 0 24 24" role="presentation" style="width: 13px; height: 13px;"><path d="${mdiCircleOutline}" style="fill: ${nldi.colors.epa};"></path></svg>`);
        addSvgImage(map, 'mapNldiWade', `<svg viewBox="0 0 24 24" role="presentation" style="width: 12px; height: 12px;"><path d="${mdiCircle}" style="fill: ${nldi.colors.wade};"></path></svg>`);

        setIsMapLoaded(true);
      });
    }

  }, [map, setCoords]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;
    updateMapControls(map, user);
  }, [user, map, sources, layers, isMapLoaded]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;

    const removedLayers = prevLayers?.filter(a => !layers.find(b => b.id === a));
    removedLayers?.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });

    const removedSources = prevSources?.filter(a => !sources.find(b => b.id === a));
    removedSources?.forEach(sourceId => {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });

    sources?.forEach(source => {
      if (!map.getSource(source.id)) {
        map.addSource(source.id, source.source);
      }
    });

    layers?.forEach(layer => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer);
      }
    });
  }, [layers, sources, map, isMapLoaded, prevSources, prevLayers]);

  const updateMapControls = (map: mapboxgl.Map, user: User | null) => {
    if (!map) return;

    if (map.hasControl(geocoderControl.current)) {
      map.removeControl(geocoderControl.current);
    }

    if (map.hasControl(navControl.current)) {
      map.removeControl(navControl.current);
    }

    // Only allow location search for logged in users
    if (user) {
      geocoderControl.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: map
      });
      map.addControl(geocoderControl.current);
    }

    map.addControl(navControl.current);
  }

  const [, dropRef] = useDrop({
    accept: 'nldiMapPoint',
    drop: () => coords,
    collect: () => { }
  })

  return (
    <div className="position-relative h-100">
      <div className="map-coordinates">{coords?.lat.toFixed(4)} {coords?.lng.toFixed(4)}</div>
      {legend}
      <div id="map" className="map h-100" ref={dropRef}></div>
    </div>
  );


}

export default Map;
