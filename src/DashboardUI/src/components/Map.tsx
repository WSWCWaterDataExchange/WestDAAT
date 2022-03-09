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
  const { map, setCurrentMap, layers, sources, legend, mapFilters } = useContext(MapContext);
  const prevSources = usePrevious(sources?.map(a => a.id));
  const prevLayers = usePrevious(layers?.map(a => a.id));

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
        style: `mapbox://styles/mapbox/${mapFilters?.mapStyle}`,
        center: [-100, 40],
        zoom: 4,
      });

      setMap.current(map);

      map.on("load", () => {
        setIsMapLoaded(true);
      });
    }
  });

  useEffect(() => {
    if (!map) return;
    updateMapControls(map, user);
  }, [user, map]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;
    updateMapControls(map, user);
  }, [user, map, sources, layers, isMapLoaded]);

  useEffect(() => {
    if (!isMapLoaded || !map) return;

    const stylesLoaded = new Promise((resolve, reject) => {
      // If the map style is changed, wait for it to load before continuing
      const prevStyle = map.getStyle().metadata["mapbox:origin"];
      if (mapFilters?.mapStyle !== prevStyle) {
        map.once("styledata", () => {
          resolve(true);
        });
        map.setStyle(`mapbox://styles/mapbox/${mapFilters?.mapStyle}`);
      }
      else {
        resolve(true);
      }
    });

    stylesLoaded.then(() => {
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, sources, map, isMapLoaded, mapFilters.mapStyle]);

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
