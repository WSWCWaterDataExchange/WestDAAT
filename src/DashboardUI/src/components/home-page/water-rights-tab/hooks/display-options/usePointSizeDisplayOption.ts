import { useCallback, useContext } from "react";
import { WaterRightsContext } from "../../Provider";

export function usePointSizeDisplayOption() {
  const { displayOptions: { pointSize }, setDisplayOptions } = useContext(WaterRightsContext);

  const setPointSize = useCallback((pointSize: string) => {
    setDisplayOptions(s => ({ ...s, pointSize: pointSize === "f" ? "f" : pointSize === "v" ? "v" : "d" }));
  }, [setDisplayOptions]);

  return { pointSize, setPointSize };
}
