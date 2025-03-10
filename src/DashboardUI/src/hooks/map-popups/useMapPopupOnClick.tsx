import { ReactElement, useCallback } from 'react';
import { useMapContext } from '../../contexts/MapProvider';

function useMapPopupOnClick() {
  const { mapClickedFeatures, setMapPopup } = useMapContext();
  const updatePopup = useCallback(
    (element: ReactElement | undefined) => {
      if (element && mapClickedFeatures?.latitude && mapClickedFeatures?.longitude) {
        setMapPopup({
          latitude: mapClickedFeatures.latitude,
          longitude: mapClickedFeatures.longitude,
          element: element,
        });
      } else {
        setMapPopup(null);
      }
    },
    [setMapPopup, mapClickedFeatures?.latitude, mapClickedFeatures?.longitude],
  );
  return { updatePopup, clickedFeatures: mapClickedFeatures?.features };
}
export default useMapPopupOnClick;
