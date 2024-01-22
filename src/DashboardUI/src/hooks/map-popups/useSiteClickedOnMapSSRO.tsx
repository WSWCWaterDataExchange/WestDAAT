import { useMemo } from "react";
import { siteSpecificProperties } from "../../config/constants";
import useMapPopupOnClick from "./useMapPopupOnClick";

function useSiteClickedOnMapSSRO() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const siteUuid = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) {
      return undefined;
    }

    const siteFeature = clickedFeatures.find(a => a.properties && a.properties[siteSpecificProperties.siteUuid as string]);
    if (!siteFeature || !siteFeature.properties) {
      return undefined;
    }

    return siteFeature.properties[siteSpecificProperties.siteUuid as string];
  }, [clickedFeatures]);
  return { updatePopup, siteUuid };
}
export default useSiteClickedOnMapSSRO;