import { useMapContext, MapStyle } from "../../contexts/MapProvider";

export function MapThemeSelector() {
  const {
    mapStyle, setMapStyle
  } = useMapContext();

  return (
    <div className="map-themes">
      {(() => {
        const isActive = (style: MapStyle) => style === mapStyle ? "active" : "";
        return <>
          <img onClick={() => setMapStyle(MapStyle.Light)} className={isActive(MapStyle.Light)} alt="light map" src="/map-themes/light.png" />
          <img onClick={() => setMapStyle(MapStyle.Dark)} className={isActive(MapStyle.Dark)} alt="dark map" src="/map-themes/dark.png" />
          <img onClick={() => setMapStyle(MapStyle.Street)} className={isActive(MapStyle.Street)} alt="streets map" src="/map-themes/streets.png" />
          <img onClick={() => setMapStyle(MapStyle.Outdoor)} className={isActive(MapStyle.Outdoor)} alt="outdoors map" src="/map-themes/outdoor.png" />
          <img onClick={() => setMapStyle(MapStyle.Satellite)} className={isActive(MapStyle.Satellite)} alt="satellite map" src="/map-themes/satelite.png" />
        </>;
      })()}
    </div>);
}
