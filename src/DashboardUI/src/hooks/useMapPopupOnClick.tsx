import { ReactElement, useCallback, useContext, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { MapContext } from "../components/MapProvider";

function useMapPopupOnClick() {
  const {
    mapClickedFeatures,
    setMapPopup
  } = useContext(MapContext);
  const updatePopup = useCallback((element: ReactElement | undefined) => {
    if (element && mapClickedFeatures?.latitude && mapClickedFeatures?.longitude) {
      setMapPopup({
        latitude: mapClickedFeatures.latitude,
        longitude: mapClickedFeatures.longitude,
        markup: ReactDOMServer.renderToStaticMarkup(element)
      })
    } else{
      setMapPopup(null);
    }
  }, [setMapPopup, mapClickedFeatures?.latitude, mapClickedFeatures?.longitude])
  return { updatePopup, clickedFeatures: mapClickedFeatures?.features };
}
export default useMapPopupOnClick;