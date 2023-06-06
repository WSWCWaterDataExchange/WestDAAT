import { ReactChild, useEffect, useMemo, useState } from "react";
import { MapAlertPriority, useMapContext } from "../contexts/MapProvider";
import { MapAlertCard } from "../components/MapAlertCard";
import { CardProps } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

export function useMapAlert(isActive: boolean, header?: ReactChild, body?: ReactChild, cardProps?: CardProps, priority: MapAlertPriority = MapAlertPriority.Information) {
  const {
    changeAlertDisplay,
    removeAlertDisplay
  } = useMapContext();
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const key = useMemo(() => {
    return uuidv4();
  }, [])
  useEffect(() => {
    return () => removeAlertDisplay(key)
  }, [key, removeAlertDisplay])
  useEffect(() => {
    if (!isActive && isManuallyClosed) {
      setIsManuallyClosed(false);
    }
  }, [isActive, isManuallyClosed, setIsManuallyClosed]);
  const alert = useMemo(() => (
    <div className="no-map-results-alert">
      <MapAlertCard cardProps={cardProps} onClosePopup={() => setIsManuallyClosed(true)}>
        {{
          header: header,
          body: body
        }}
      </MapAlertCard>
    </div>)
    , [header, body, cardProps])
  useEffect(() => {
    changeAlertDisplay(key, isActive && !isManuallyClosed, alert, priority);
  }, [isActive, isManuallyClosed, alert, key, priority, changeAlertDisplay, removeAlertDisplay]);
}

export function useNoMapResults(isNoResultsEnabled: boolean) {
  const {
    isMapRendering,
    renderedFeatures
  } = useMapContext();
  const hasRenderedFeatures = useMemo(() => renderedFeatures.length > 0, [renderedFeatures.length]);
  const [header, body] = useMemo(() => {
    return [
      <h5 className="card-title">No Matching Results</h5>,
      <>Sorry, these filter combinations have no water rights in this view or map zoom level.<br />Please try different criteria or a different map area that may have the data you're looking for.</>
    ]
  }, []);
  useMapAlert(isNoResultsEnabled && !isMapRendering && !hasRenderedFeatures, header, body)
}

export function useNldiPinDropAlert(needsToSetNldiLocation: boolean) {
  const [header, body] = useMemo(() => {
    return [
      <h5 className="card-title">Select Search Location</h5>,
      <>Drag and drop the red 'Pin Icon' from the left bar to the map to select your search location</>
    ]
  }, []);
  useMapAlert(needsToSetNldiLocation, header, body)
}
