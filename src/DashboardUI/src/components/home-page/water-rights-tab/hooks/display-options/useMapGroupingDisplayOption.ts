import { useCallback, useContext } from "react";
import { WaterRightsContext } from "../../Provider";
import { MapGrouping } from "../../MapGrouping";
import { defaultDisplayOptions } from "../../DisplayOptions";

export function useMapGroupingDisplayOption() {
  const {displayOptions: {mapGrouping}, setDisplayOptions} = useContext(WaterRightsContext);

  const setMapGrouping = useCallback((mapGrouping: MapGrouping | undefined) => {
    setDisplayOptions(s=>({...s, mapGrouping: mapGrouping ?? defaultDisplayOptions.mapGrouping}))
  }, [setDisplayOptions]);

  return {mapGrouping, setMapGrouping};
}
