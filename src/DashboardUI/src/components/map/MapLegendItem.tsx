import React, { PropsWithChildren } from 'react';
import { mdiMapMarker } from '@mdi/js';
import Icon from '@mdi/react';
import { EmptyPropsWithChildren } from '../../HelperTypes';

export function MapLegendItem({ children }: Readonly<EmptyPropsWithChildren>) {
  return <div className="legend-item">{children}</div>;
}

interface MapLegendCircleItemProps {
  color: string;
}
export function MapLegendCircleItem({
  color,
  children,
}: PropsWithChildren<MapLegendCircleItemProps>) {
  return (
    <MapLegendItem>
      <span className="legend-circle" style={{ backgroundColor: color }}></span>
      {children}
    </MapLegendItem>
  );
}

interface MapLegendMapPointerItemProps {
  color: string;
}
export function MapLegendMarkerItem({
  color,
  children,
}: PropsWithChildren<MapLegendMapPointerItemProps>) {
  return (
    <MapLegendItem>
      <Icon path={mdiMapMarker} size="16px" color={color} />
      {children}
    </MapLegendItem>
  );
}
