import { useWaterRightSiteLocations } from "../hooks";
import useSiteDigestMapPopup from "../hooks/map-popups/useSiteDigestMapPopup";
import DetailsMap from "./DetailsMap";

interface waterRightMapProps {
  allocationUuid: string;
}

function WaterRightMap(props: waterRightMapProps) {
  const {
    data: waterRightSiteLocations,
    isFetching: isWaterRightSiteLocationsLoading,
  } = useWaterRightSiteLocations(props.allocationUuid);

  useSiteDigestMapPopup();

  return (
    <DetailsMap isDataLoading={isWaterRightSiteLocationsLoading} mapData={waterRightSiteLocations} />
  );
}

export default WaterRightMap;
