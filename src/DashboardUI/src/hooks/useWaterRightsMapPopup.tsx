import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import useMapPopupOnClick from "./useMapPopupOnClick";
import { MapPopupCard } from "../components/MapPopupCard";
import WaterRightsMapPopup from "../components/WaterRightsMapPopup";
import { waterRightsProperties } from "../config/constants";

export function useWaterRightsMapPopup() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const clickedSiteUuid = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) {
      return undefined;
    }
    const feature = clickedFeatures.find(a => a.properties && a.properties[waterRightsProperties.siteUuid as string]);
    if (!feature || !feature.properties) {
      return undefined;
    }
    return feature.properties[waterRightsProperties.siteUuid as string];
  }, [clickedFeatures]);

  const tempFakeQuery = async (siteUuid: string): Promise<{ waterRights: Array<{ id: string; nativeId: string; beneficialUses: string[]; priorityDate: string; }>; siteUuid: string; } | null> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      waterRights: [
        {
          id: "518",
          nativeId: "nativeId-518",
          beneficialUses: ["Livestock"],
          priorityDate: "1981-10-05"
        },
        {
          id: "519",
          nativeId: "nativeId-519",
          beneficialUses: ["Livestock2"],
          priorityDate: "2022-03-24"
        },
        {
          id: "520",
          nativeId: "nativeId-520",
          beneficialUses: ["Livestock3", "Fire"],
          priorityDate: "2022-03-25"
        }
      ], siteUuid: siteUuid
    };
  };

  const { data, isFetching } = useQuery(['siteDigest', clickedSiteUuid], async () => await tempFakeQuery(clickedSiteUuid), {
    enabled: !!clickedSiteUuid,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: 8600000,
    staleTime: Infinity
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [data, setCurrentIndex]);

  const result = useMemo(() => {
    if (isFetching) {
      return <MapPopupCard onClosePopup={handleClosePopup}>
        {{
          header: "Loading",
          body: <span className="text-nowrap">Retrieving data for {clickedSiteUuid}</span>
        }}
      </MapPopupCard>;
    }
    if (!data) {
      return <MapPopupCard onClosePopup={handleClosePopup}>
        {{
          header: "Error",
          body: <span className="text-nowrap">Unable to find data for {clickedSiteUuid}</span>
        }}
      </MapPopupCard>;
    }
    return <WaterRightsMapPopup data={data} onSelectedIndexChanged={setCurrentIndex} currentIndex={currentIndex} onClosePopup={handleClosePopup} />;
  }, [isFetching, clickedSiteUuid, data, currentIndex, handleClosePopup, setCurrentIndex]);

  useEffect(() => {
    updatePopup(result);
  }, [updatePopup, result]);
}
