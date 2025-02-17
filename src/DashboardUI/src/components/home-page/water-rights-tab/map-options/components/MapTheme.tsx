import React from 'react';
import { MapThemeSelector } from '../../../../map/MapThemeSelector';

export function MapTheme() {
  return (
    <div className="mb-3 px-4">
      <label className="fw-bold">Map Theme</label>
      <div className="mt-2">
        <MapThemeSelector />
      </div>
    </div>
  );
}

export default MapTheme;
