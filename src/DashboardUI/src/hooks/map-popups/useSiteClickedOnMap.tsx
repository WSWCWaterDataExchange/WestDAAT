import { useMemo } from 'react';
import {overlayProperties, waterRightsProperties} from '../../config/constants';
import useMapPopupOnClick from './useMapPopupOnClick';

function useSiteClickedOnMap() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const { siteUuid, oType } = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) {
      return { siteUuid: undefined, oType: undefined };
    }

    const siteFeature = clickedFeatures.find(
      (a) =>
        a.properties &&
        (a.properties[waterRightsProperties.siteUuid as string] ||
          a.properties[overlayProperties.overlayType as string])
    );

    if (!siteFeature || !siteFeature.properties) {
      return { siteUuid: undefined, oType: undefined };
    }

    return {
      siteUuid: siteFeature.properties[waterRightsProperties.siteUuid as string],
      oType: siteFeature.properties[overlayProperties.overlayType as string],
    };
  }, [clickedFeatures]);

  return { updatePopup, siteUuid, oType };
}

export default useSiteClickedOnMap;
