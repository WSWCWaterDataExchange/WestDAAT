import mapboxgl, { AnyLayer, AnySourceData } from "mapbox-gl";
import { useEffect, useState } from "react";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import "../styles/map.scss";
import mapConfig from "../config/maps.json";

enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
}

interface MapData {
  sources: { id: string, source: AnySourceData}[];
  layers: ({legendValue: string} & AnyLayer)[];
}

interface MapProps {
}

function Map(props: MapProps) {

  const [mapData, setMapData] = useState((mapConfig as any)[MapTypes.WaterRights] as MapData);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    let map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [-100, 40],
      zoom: 4,
    });

    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
      })
    );

    map.addControl(new mapboxgl.NavigationControl());

    loadData(map);
  });

  const loadData = (map: mapboxgl.Map) => {
    
    map.on("load", function () {

      mapData.sources.forEach(s =>
        map.addSource(s.id, s.source as AnySourceData)
      );

      mapData.layers.forEach(layer =>
        map.addLayer(layer as AnyLayer)
      );
    });
  }

  return (
    <div className="position-relative h-100">
      <div className="legend">
        <div>
          {
            mapData.layers.sort((a, b) =>
              a.legendValue > b.legendValue ? 1 : -1
            ).map(layer =>
              <div key={layer.id}>
                <span style={{ "backgroundColor": (layer as any).paint["circle-color"] }}></span>
                {layer.legendValue}
              </div>
            )
          }
        </div>
      </div>
      <div id="map" className="map h-100"></div>
    </div>
  );
}

export default Map;
