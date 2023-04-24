import { useWaterRightSiteLocations } from "../hooks";
import DetailsMap from "./DetailsMap";

interface waterRightMapProps {
  allocationUuid: string;
}

function WaterRightMap(props: waterRightMapProps) {
  const {
    data: waterRightSiteLocations,
    isFetching: isWaterRightSiteLocationsLoading,
  } = useWaterRightSiteLocations(props.allocationUuid);

  return (
    <DetailsMap isDataLoading={isWaterRightSiteLocationsLoading} mapData={waterRightSiteLocations} />
  );
}

export default WaterRightMap;
