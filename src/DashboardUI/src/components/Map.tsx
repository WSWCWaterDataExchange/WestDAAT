import mapboxgl, { NavigationControl } from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import "../styles/map.scss";
import { AppContext, User } from "../AppProvider";
import { MapContext } from "./MapProvider";
import usePrevious from "../hooks/usePrevious";

// Fix transpile errors. Mapbox is working on a fix for this
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map() {

  const { user } = useContext(AppContext);
  const { map, setCurrentMap, layers, sources, legend } = useContext(MapContext);
  const prevSources = usePrevious(sources);
  const prevLayers = usePrevious(layers);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const setMap = useRef(setCurrentMap);
  const navControl = useRef(new NavigationControl());
  let geocoderControl = useRef(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  }));

  useEffect(() => {
    if (!map) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        center: [-100, 40],
        zoom: 4,
      });

      setMap.current(map);

      map.on("load", () => {
        setIsMapLoaded(true);
      });
    }

  }, [map]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;
    updateMapControls(map, user);
  }, [user, map, sources, layers, isMapLoaded]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;

    prevLayers?.forEach(layer => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    });
    prevSources?.forEach(source => {
      if (map.getSource(source.id)) {
        map.removeSource(source.id);
      }
    });
    sources?.forEach(source => {
      map.addSource(source.id, source.source);
    });
    layers?.forEach(layer => {
      map.addLayer(layer);
    });
  }, [layers, sources, map, isMapLoaded]);

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

  return (
    <div className="position-relative h-100">
      {legend}
      <div id="map" className="map h-100"></div>
    </div>
  );
}

export default Map;
