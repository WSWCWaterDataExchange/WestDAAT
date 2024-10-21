import { useMemo } from 'react';
import { waterRightsProperties } from '../../config/constants';
import useMapPopupOnClick from './useMapPopupOnClick';

function useSiteClickedOnMap() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const siteUuid = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) {
      return undefined;
    }

    const siteFeature = clickedFeatures.find(
      (a) =>
        a.properties && a.properties[waterRightsProperties.siteUuid as string],
    );
    if (!siteFeature || !siteFeature.properties) {
      return undefined;
    }

    return siteFeature.properties[waterRightsProperties.siteUuid as string];
  }, [clickedFeatures]);
  return { updatePopup, siteUuid };
}

export default useSiteClickedOnMap;
