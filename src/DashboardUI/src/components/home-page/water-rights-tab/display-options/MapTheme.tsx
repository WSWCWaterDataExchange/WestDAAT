import { MapThemeSelector } from "../../../map/MapThemeSelector";

export function MapTheme() {
return <div className="mb-3">
         <label>Map Layer</label>
         <MapThemeSelector />
       </div>
}