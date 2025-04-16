import { useMemo } from 'react';
import { overlayProperties, waterRightsProperties } from '../../config/constants';
import useMapPopupOnClick from './useMapPopupOnClick';

function useSiteClickedOnMap() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();

  const features = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) return [];

    return clickedFeatures.map((feature) => {
      const siteUuid = feature.properties?.[waterRightsProperties.siteUuid as string];
      const oType = feature.properties?.[overlayProperties.overlayType as string];
      return {
        rawFeature: feature,
        siteUuid,
        oType,
      };
    });
  }, [clickedFeatures]);

  return { updatePopup, features };
}

export default useSiteClickedOnMap;
