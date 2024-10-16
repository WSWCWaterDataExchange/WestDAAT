import React from 'react';
import { mdiMapMarker } from "@mdi/js";
import Icon from "@mdi/react";
import { PropsWithChildren } from "react";

export function MapLegendItem({children}: PropsWithChildren<{}>) {
  return (
    <div className="legend-item">
      {children}
    </div>
  )
}

interface MapLegendCircleItemProps {
  color: string
}
export function MapLegendCircleItem({color, children}: PropsWithChildren<MapLegendCircleItemProps>) {
  return (
    <MapLegendItem>
      <span className="legend-circle" style={{ "backgroundColor": color }}></span>
      {children}
    </MapLegendItem>
  )
}

interface MapLegendMapPointerItemProps {
  color: string
}
export function MapLegendMarkerItem({color, children}: PropsWithChildren<MapLegendMapPointerItemProps>) {
  return (
    <MapLegendItem>
      <Icon path={mdiMapMarker} size="16px" color={color} />
      {children}
    </MapLegendItem>
  )
}