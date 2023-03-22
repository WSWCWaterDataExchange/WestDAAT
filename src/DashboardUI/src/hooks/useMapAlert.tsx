import { ReactChild, useContext, useEffect, useMemo, useState } from "react";
import { MapAlertPriority, MapContext } from "../components/MapProvider";
import { MapAlertCard } from "../components/MapAlertCard";
import { CardProps } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

export function useMapAlert(isActive: boolean, header?: ReactChild, body?: ReactChild, cardProps?: CardProps, priority: MapAlertPriority = MapAlertPriority.Information) {
  const {
    changeAlertDisplay,
    removeAlertDisplay
  } = useContext(MapContext);
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

export function useMapErrorAlert(isError: boolean) {
  const [header, body, options] = useMemo(() => {
    return [
      <h5 className="card-title">Error</h5>,
      <>Something went wrong.  Please try again.</>,
      { className: "text-white bg-danger" }
    ]
  }, []);
  useMapAlert(isError, header, body, options, MapAlertPriority.Error)
}

export function useNoMapResults(hasNoResults: boolean) {
  const [header, body] = useMemo(() => {
    return [
      <h5 className="card-title">No Matching Results</h5>,
      <>Sorry, these filter combinations have no water rights in this view or map zoom level.<br />Please try different criteria or a different map area that may have the data you're looking for.</>
    ]
  }, []);
  useMapAlert(hasNoResults, header, body)
}
