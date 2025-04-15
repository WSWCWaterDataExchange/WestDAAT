import { useEffect } from 'react';
import { useMapContext } from '../../contexts/MapProvider';
import MultiFeaturePopup from "./MultiFeaturePopup";

function useMultiFeatureMapPopup() {
  const { mapClickedFeatures, setMapPopup } = useMapContext();

  useEffect(() => {
    if (!mapClickedFeatures || mapClickedFeatures.features.length === 0) {
      setMapPopup(null);
      return;
    }

    const { latitude, longitude, features } = mapClickedFeatures;

    const popupElement = (
      <MultiFeaturePopup
        features={features}
        latitude={latitude}
        longitude={longitude}
        onClose={() => setMapPopup(null)}
      />
    );

    setMapPopup({
      latitude,
      longitude,
      element: popupElement,
    });
  }, [mapClickedFeatures, setMapPopup]);
}

export default useMultiFeatureMapPopup;
