import { useContext, useEffect } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";
import { useNldiFeatures } from "./useNldiQuery";
import { NldiFilters } from "../FilterProvider";
import { MapContext } from "../components/MapProvider";
import { useMapErrorAlert } from "./useMapAlert";
import useProgressIndicator from "./useProgressIndicator";

const pointFeatureDataSourceNameKeys = [DataPoints.Wade, DataPoints.Usgs, DataPoints.Epa];
const pointFeatureDataSourceNames: Record<DataPoints, string> = {
  [DataPoints.Wade]: "Wade",
  [DataPoints.Usgs]: "UsgsSurfaceWaterSite",
  [DataPoints.Epa]: "EpaWaterQualitySite"
};

const directionNameKeys = [Directions.Upsteam, Directions.Downsteam];
const directionNames: Record<Directions, string> = {
  [Directions.Upsteam]: "Upstream",
  [Directions.Downsteam]: "Downstream"
};
function useNldiMapFiltering(nldiFilters: NldiFilters | null) {
  const { setGeoJsonData, setLayerFilters: setMapLayerFilters } = useContext(MapContext);
  const { data: nldiGeoJsonData, isFetching: isNldiDataFetching, isError: isNldiDataError } = useNldiFeatures(nldiFilters?.latitude ?? null, nldiFilters?.longitude ?? null);

  useProgressIndicator([!isNldiDataFetching], "Loading NLDI Data");

  useEffect(() => {
    if (nldiGeoJsonData) {
      setGeoJsonData('nldi', nldiGeoJsonData)
    }
  }, [nldiGeoJsonData, setGeoJsonData]);

  useEffect(() => {
    if(nldiFilters)
    {
      let pointsTypeFilters: any[] = ["any"];
      for (const key of pointFeatureDataSourceNameKeys) {
        if (nldiFilters.dataPoints & key) {
          pointsTypeFilters.push(["==", ["get", "westdaat_pointdatasource"], pointFeatureDataSourceNames[key]])
        }
      }

      let directionFilters: any[] = ["any"];
      for (const key of directionNameKeys) {
        if (nldiFilters.directions & key) {
          directionFilters.push(["==", ["get", "westdaat_direction"], directionNames[key]])
        }
      }

      setMapLayerFilters([{
        layer: 'nldi-usgs-points',
        filter: ["all",
          ["==", ["get", "westdaat_featuredatatype"], "Point"],
          ["!=", ["get", "westdaat_pointdatasource"], "Wade"],
          pointsTypeFilters,
          directionFilters
        ]
      }, {
        layer: 'nldi-flowlines',
        filter: ["all",
          ["==", ["get", "westdaat_featuredatatype"], "Flowline"],
          directionFilters
        ]
      }])
    }
  }, [nldiFilters, setMapLayerFilters]);

  useMapErrorAlert(isNldiDataError);
  return [isNldiDataFetching]
}
export default useNldiMapFiltering;