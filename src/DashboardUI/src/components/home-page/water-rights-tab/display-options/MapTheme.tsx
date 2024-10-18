import React from 'react';
import { MapThemeSelector } from "../../../map/MapThemeSelector";

export function MapTheme() {
return <div className="mb-3">
         <label className="pb-1">Map Layer</label>
         <MapThemeSelector />
       </div>
}