import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { ApiData } from "../ApiInterface";
import { useMapContext } from "../../../../contexts/MapProvider";
import { MapThemeSelector } from "../../../map/MapThemeSelector";
import "../time.scss";

interface TimeMapProps {
  apiData: ApiData[] | null;
}
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";

function TimeMap({ apiData }: TimeMapProps) {
  const { mapStyle } = useMapContext();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  const resetMap = () => {
    if (map) {
      map.flyTo({
        center: [-100, 40],
        zoom: 4,
        essential: true,
      });
    }
    if (marker) {
      marker.remove();
    }
  };

  useEffect(() => {
    // Create a new map instance
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100, 40], // Set the initial center coordinates
      zoom: 4, // Set the initial zoom level
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());
    setMap(mapInstance);
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  useEffect(() => {
    resetMap();
    if (map && Object(apiData).TotalSiteVariableAmountsCount > 0) {
      map.resize();
      const longitude = Number(
        Object(apiData).Organizations[0].Sites[0].Longitude
      );
      const latitude = Number(
        Object(apiData).Organizations[0].Sites[0].Latitude
      );

      // Use map.flyTo to smoothly animate to the new location and zoom level
      map.flyTo({
        center: [longitude, latitude], // New center coordinates
        zoom: 10, // New zoom level
        essential: true,
      });

      // Create a marker and popup
      const newMarker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

      setMarker(newMarker);
      newMarker.setPopup(
        new mapboxgl.Popup().setHTML(
          `<p><strong>Native Site ID: </strong>${
            Object(apiData).Organizations[0].Sites[0].NativeSiteID
          }</p>
                <p><strong>WaDE Site ID: </strong>${
                  Object(apiData).Organizations[0].Sites[0].SiteUUID
                }</p>
                <p><strong>Site Name: </strong>${
                  Object(apiData).Organizations[0].Sites[0].SiteName
                }</p>
                <p><strong>Site Type: </strong>${
                  Object(apiData).Organizations[0].Sites[0].SiteTypeCV
                }</p>
                <p><strong>Water Source Type: </strong>${
                  Object(apiData).Organizations[0].WaterSources[0]
                    .WaterSourceTypeCV
                }</p>
                <p><strong>Varaible Type: </strong>${
                  Object(apiData).Organizations[0].VariableSpecifics[0]
                    .VariableSpecificTypeCV
                }</p>`
        )
      );
    }
  }, [apiData, map]);
  useEffect(() => {
    if (map) {
      map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
    }
  }, [map, mapStyle]);

  return (
    <div className="position-relative h-100">
      <div className="time-series-theme">
        <MapThemeSelector />
      </div>
      <div id="map" className="mapthemese h-100"></div>
    </div>
  );
}

export default TimeMap;
