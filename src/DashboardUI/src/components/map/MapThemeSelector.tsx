import React from 'react';
import { useCallback, useMemo } from 'react';
import { useMapContext, MapStyle } from '../../contexts/MapProvider';

import './map-theme-selector.scss';

export function MapThemeSelector() {
  return (
    <div className="map-themes">
      <StyleButton style={MapStyle.Light} friendlyName="Light" />
      <StyleButton style={MapStyle.Dark} friendlyName="Dark" />
      <StyleButton style={MapStyle.Street} friendlyName="Street" />
      <StyleButton style={MapStyle.Outdoor} friendlyName="Outdoor" />
      <StyleButton style={MapStyle.Satellite} friendlyName="Satellite" />
    </div>
  );
}

interface StyleButtonProps {
  style: MapStyle;
  friendlyName: string;
}
function StyleButton({ style, friendlyName }: StyleButtonProps) {
  const { isMapLoaded, isMapRendering, mapStyle, setMapStyle } = useMapContext();

  const isActive = useMemo(() => {
    return style === mapStyle;
  }, [style, mapStyle]);

  const classes = useMemo(() => {
    return `btn btn-link p-0 ${style}${isActive ? ' active' : ''}`;
  }, [isActive, style]);

  const onClickAction = useCallback(() => {
    if (isActive) return undefined;
    return setMapStyle(style);
  }, [isActive, style, setMapStyle]);

  const tabIndex = useMemo(() => {
    return isActive ? -1 : undefined;
  }, [isActive]);

  return (
    <button
      type="button"
      title={`${friendlyName} Map Theme`}
      aria-label={`Select ${friendlyName} Map Theme`}
      aria-pressed={isActive}
      tabIndex={tabIndex}
      onClick={onClickAction}
      className={classes}
      disabled={!isMapLoaded || isMapRendering}
    ></button>
  );
}
