import React, { useEffect, useState } from "react";
import mapboxgl, { AnyLayer } from "mapbox-gl";
import "./TimeSeriesMap.scss";
import Icon from "@mdi/react";
import { mdiOpenInNew } from "@mdi/js";
import ReactDOM from "react-dom";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import Select from "react-select";

interface OptionType {
  label: string;
  value: string;
}

function TimeFullMap() {

  const wadeNameSColors = {
    "Type1": "#FF0000", // Red
    "Type2": "#00FF00", // Green
    "Type3": "#0000FF", // Blue
    "Type4": "#5730A2", // purple
    "Type5": "#F3BA30", // orange
    "Type6": "#F33077", // pink
  };

  
  const [wadeNameSData, setWadeNameSData] = useState<Set<any>>(new Set());

  const [selectedSiteTypeCV, setSelectedSiteTypeCV] = useState<string | null>(
    null
  );
  const [selectedWadeNameS, setSelectedWadeNameS] = useState<string | null>(
    null
  );

  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleWadeNameSChange = (selectedOption: OptionType | null) => {
    setSelectedWadeNameS(selectedOption?.value || null);
  };

  useEffect(() => {
    mapboxgl.accessToken = mapboxgl.accessToken;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/amabdallah/clpa0f7dx001901op5ihpfqev",
      center: [-110, 40],
      zoom: 5,
    });
    setMapInstance(map);

    map.on("load", async () => {
      // Add a click event listener to the map
      setWadeNameSData(new Set());
      map
        ?.queryRenderedFeatures({ layers: ["50"] } as any)
        ?.forEach((feature: { properties: any }) => {
          const properties = feature.properties;

          if (properties) {
            setIsMapLoaded(true);

            setWadeNameSData(
              (prevData) => new Set([...prevData, properties.WaDENameS])
            );
          }
        });

      map.on(
        "click",
        "50",
        (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
          // Check if e.features is not undefined and contains at least one feature
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];

            const properties = feature.properties;

            if (properties) {
              const coordinates = (feature.geometry as any).coordinates;

              const popupContent = (
                <div>
                  <Card className="popup-card">
                    <CardHeader className="popup-header">
                      <div>
                        Site ID:{" "}
                        <a
                          href={`/details/timeSeriesPage/${properties.SiteUUID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {properties.SiteUUID}{" "}
                          <Icon
                            path={mdiOpenInNew}
                            className="map-popup-card-time-site-link-icon"
                          />
                        </a>
                      </div>
                    </CardHeader>
                    <div className="popup-body">
                      <p>
                        <b>SiteNativeID:</b>
                        <br /> {properties.SiteNativeID}
                      </p>
                      <p>
                        <b>SiteName:</b>
                        <br /> {properties.SiteName}
                      </p>
                      <p>
                        <b>SiteTypeCV:</b>
                        <br /> {properties.SiteTypeCV}
                      </p>
                    </div>
                  </Card>
                </div>
              );

              const popupNode = document.createElement("div");
              ReactDOM.render(popupContent, popupNode);

              const popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupNode)
                .addTo(map);
            }
          }
        }
      );

      map.on("mouseenter", "50", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "50", () => {
        map.getCanvas().style.cursor = "";
      });
      const layerStyle: AnyLayer = {
        id: 'wade-points',
        type: 'circle',  // Ensure this is a string literal matching a valid Mapbox layer type
        paint: {
          'circle-color': [
            'match',
            ["get", "WaDENameS"],
            "Type1", wadeNameSColors["Type1"],
            "Type2", wadeNameSColors["Type2"],
            "Type3", wadeNameSColors["Type3"],
            "Type4", wadeNameSColors["Type4"],
            "Type5", wadeNameSColors["Type5"],
            "Type6", wadeNameSColors["Type6"],
            "#000000" // Default color
          ]
        }
        // ... other layer properties
      };

      // Add the layer to your map
      map.addLayer(layerStyle);
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapInstance && isMapLoaded) {
      // Check if a specific site type is selected
      const siteTypeCVFilter = selectedSiteTypeCV
        ? ["all", ["==", "SiteTypeCV", selectedSiteTypeCV]]
        : ["!=", "", ""]; // Show all points when no specific site type is selected

      // Check if a specific site type is selected
      const wadeNameSFilter = selectedWadeNameS
        ? ["all", ["==", "WaDENameS", selectedWadeNameS]]
        : ["!=", "", ""]; // Show all points when no specific site type is selected
      const combinedFilter = ["all", siteTypeCVFilter, wadeNameSFilter];

      mapInstance.setFilter("50", combinedFilter);
    }
  }, [selectedSiteTypeCV, isMapLoaded, selectedWadeNameS]);

  return (
    <div className="time-series-home-map">
      <div className="time-series-home-filter">
        <label>Select WaDE Type:</label>
        <Select
          onChange={handleWadeNameSChange}
          value={
            wadeNameSData.has(selectedWadeNameS)
              ? {
                  label: selectedWadeNameS || "",
                  value: selectedWadeNameS || "",
                }
              : null
          }
          options={[
            { value: "", label: "All" },
            ...Array.from(wadeNameSData).map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
      </div>
      <div
        id="map"
        className="series-map"
        style={{ width: "100%", height: "90vh" }}
      ></div>
    </div>
  );
}

export default TimeFullMap;
